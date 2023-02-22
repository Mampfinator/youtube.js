import { request } from "undici";
import {
    type Request as ExpressRequest,
    type Response as ExpressResponse,
} from "express";
import EventEmitter from "events";
import { createHmac } from "crypto";

type Mode = "subscribe" | "unsubscribe";

type PendingSubscription<TMode extends Mode> = {
    mode: TMode;
    channelId: string;
    resolve: TMode extends "subscribe" ? (lease: number) => void : () => void;
    reject: (reason: any) => void;
};

interface PubsubListenerOptions {
    timeout?: number;
    client: PubsubClient;
    secret?: string;
}

type Callback = (request: ExpressRequest, response: ExpressResponse) => any;

function verifyPostMessage(
    body: string,
    hubSignature?: string,
    link?: string,
    secret?: string,
): { valid: boolean; status: number } {
    if (!link) return { valid: false, status: 400 };

    if (secret) {
        if (!hubSignature) return { valid: false, status: 403 };
        const [algo, signature] = hubSignature.split("=");
        try {
            const computedSignature = createHmac(algo, secret)
                .update(Buffer.from(body, "utf-8"))
                .digest("hex");

            if (signature !== computedSignature)
                return { valid: false, status: 204 };

            return { valid: true, status: 200 };
        } catch {
            return { valid: false, status: 403 };
        }
    }

    return { valid: true, status: 200 };
}

export class PubsubListener {
    private readonly timeout: number;
    private readonly secret?: string;
    public readonly client: PubsubClient;

    constructor(options: PubsubListenerOptions) {
        this.timeout = options.timeout ?? 2500;
        this.client = options.client;
    }

    private readonly pending: PendingSubscription<any>[] = [];

    public getGetListener(): Callback {
        return (req: ExpressRequest, res: ExpressResponse) => {
            const {
                "hub.topic": topic,
                "hub.mode": mode,
                "hub.challenge": challenge,
                "hub.lease_seconds": lease,
            } = req.query;
            if (
                !topic ||
                typeof topic !== "string" ||
                !mode ||
                typeof topic !== "string" ||
                !challenge ||
                typeof challenge !== "string"
            )
                return res.writeHead(400).send();

            const [, channelId] = topic.split("=");
            if (!channelId) return res.writeHead(400);

            switch (mode as Mode | "denied") {
                case "subscribe": {
                    const pending = this.pending.find(
                        p => p.mode === mode && p.channelId === channelId,
                    ) as PendingSubscription<"subscribe">;
                    if (!pending) break;
                    pending.resolve(Number(lease));
                    break;
                }

                case "unsubscribe": {
                    const pending = this.pending.find(
                        p => p.mode === mode && p.channelId === channelId,
                    ) as PendingSubscription<"unsubscribe">;
                    if (!pending) break;
                    pending.resolve();
                    break;
                }

                case "denied": {
                    const pending = this.pending.filter(
                        p => p.channelId === channelId,
                    );
                    for (const p of pending) {
                        p.reject("denied");
                    }
                    break;
                }
            }

            res.send(challenge);
        };
    }

    public getPostListener(): Callback {
        return (req: ExpressRequest, res: ExpressResponse) => {
            const hubSignature = req.header("x-hub-signature");
            const link = req.header("link");
            const body = JSON.stringify(req.body, null, 4); // might work, might not.

            const { valid, status } = verifyPostMessage(
                body,
                hubSignature,
                link,
                this.secret,
            );

            if (!valid) return res.status(status).send();

            // TODO
        };
    }

    public getListeners(): { get: Callback; post: Callback } {
        return {
            get: this.getGetListener(),
            post: this.getPostListener(),
        };
    }

    /**
     * @internal
     * @returns the lease
     */
    public await<TMode extends Mode>(
        mode: TMode,
        channelId: string,
    ): Promise<TMode extends "subscribe" ? number : void> {
        return new Promise<any>((resolve, reject) => {
            this.pending.push({ channelId, mode, resolve, reject });

            setTimeout(() => {
                reject("Timed out.");
            }, this.timeout);
        });
    }
}

export const EVENTSUB_TOPIC = "https://www.youtube.com/xml/feeds/videos.xml";
export const EVENTSUB_HUB_URL = "https://pubsubhubbub.appspot.com/";

export class PubsubClient extends EventEmitter {
    private readonly leases = new Map<string, NodeJS.Timeout>();
    public readonly listener: PubsubListener;

    constructor(
        private readonly callbackUrl: string,
        private readonly secret?: string,
    ) {
        super();

        this.listener = new PubsubListener({ client: this, secret });
    }

    private async _doSubscribe(mode: Mode, channelId: string) {
        const topic = `${EVENTSUB_TOPIC}?channel_id=${channelId}`;

        await request(EVENTSUB_HUB_URL, {
            method: "POST",
            query: {
                "hub.mode": mode,
                "hub.topic": topic,
                "hub.verify": "async",
                "hub.secret": this.secret,
                "hub.callback": this.callbackUrl,
            },
        });
    }

    public async subscribe(channelId: string): Promise<void> {
        const [, lease] = await Promise.all([
            this._doSubscribe("subscribe", channelId),
            this.listener.await("subscribe", channelId),
        ]);

        if (this.leases.has(channelId))
            clearTimeout(this.leases.get(channelId));
        this.leases.set(
            channelId,
            setTimeout(() => this.subscribe(channelId), lease * 1000),
        );
    }

    public async unsubscribe(channelId: string) {
        this.leases.delete(channelId);

        await Promise.all([
            this._doSubscribe("unsubscribe", channelId),
            this.listener.await("unsubscribe", channelId),
        ]);
    }
}
