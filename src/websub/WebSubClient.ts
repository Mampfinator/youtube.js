import {
    type Request as ExpressRequest,
    type Response as ExpressResponse,
} from "express";
import { verifyPostMessage } from "./websub.util";
import { err, ok, Result } from "neverthrow";
import { request } from "undici";
import {
    EVENTSUB_HUB_URL,
    EVENTSUB_TOPIC,
    XML_FEED_ATTRIBUTES,
} from "./websub.constants";
import { XMLParser } from "fast-xml-parser";
import {
    DeletedFeed,
    Feed,
    Mode,
    ResponseMode,
    WebSubMessage,
} from "./types/internal";
import { EntryDeletedPayload, EntryPayload } from "./types/external";
import EventEmitter from "events";

export interface WebSubClientOptions {
    /**
     * Where the client should expect its verification- and messageHandlers.
     */
    callbackUrl: string;
    secret: string;
    timeout?: number;
    /**
     * Whether to automatically renew subscription leases.
     * @default true
     */
    automaticRenewal?: boolean;
}

interface WebSubClientEvents {
    invalidMessage: (request: ExpressRequest) => void;
    verified: (request: ExpressRequest) => void;
    denied: (channelId: string) => void;
    subscribed: (channelId: string) => void;
    unsubscribed: (channelId: string) => void;
    message: (message: WebSubMessage) => void;
    entryDeleted: (payload: EntryDeletedPayload) => void;
    entryAdded: (payload: EntryPayload) => void;
    entryUpdated: (payload: EntryPayload) => void;
    feedModified: (payload: EntryPayload) => void;
    error: (error: any) => void;
}

export class WebSubClient extends EventEmitter {
    private readonly timeout: number;
    private readonly secret: string;
    private readonly callbackUrl: string;
    private readonly automaticRenewal: boolean;

    private readonly pending = new Map<
        `${Mode}:${string}`,
        (arg: Result<void, Error>) => void
    >();

    /**
     * Mount as GET handler on the callback path.
     */
    public readonly verificationHandler: (
        req: ExpressRequest,
        res: ExpressResponse,
    ) => void;
    /**
     * Mount as POST handler on the callback path.
     */
    public readonly messageHandler: (
        req: ExpressRequest,
        res: ExpressResponse,
    ) => void;

    constructor(options: WebSubClientOptions) {
        super();

        this.timeout = options.timeout ?? 10000;
        this.secret = options.secret;
        this.callbackUrl = options.callbackUrl;
        this.automaticRenewal = options.automaticRenewal ?? true;

        this.verificationHandler = (
            req: ExpressRequest,
            res: ExpressResponse,
        ) => {
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
            ) {
                this.emit("invalidMessage", req);
                return res.writeHead(400).send();
            }

            this.emit("verified", req);

            const [, channelId] = topic.split("=");
            if (!channelId) return res.writeHead(400);

            try {
                switch (mode as ResponseMode) {
                    case "denied":
                        this.pending.get(`subscribe:${channelId}`)?.(
                            err(new Error("Subscription denied.")),
                        );
                        this.emit("denied", channelId);
                        break;
                    case "subscribe":
                        this.pending.get(`subscribe:${channelId}`)?.(ok(undefined));
                        this.emit("subscribed", channelId);
                        break;
                    case "unsubscribe":
                        this.pending.get(`unsubscribe:${channelId}`)?.(
                            ok(undefined),
                        );
                        this.emit("unsubscribed", channelId);
                        break;
                    default:
                        throw new Error(
                            `Unknown mode "${mode}" in YouTube WebSub message for ${channelId}.`,
                        );
                    }
            } catch (error) {
                this.emit("error", error);
            }

            res.send(challenge);
        };

        this.messageHandler = (req: ExpressRequest, res: ExpressResponse) => {
            const hubSignature = req.header("x-hub-signature");
            const link = req.header("link");
            const body = req.body as string;

            if (typeof body !== "string")
                throw new Error(
                    `Expected message handler request body to be string, got ${typeof body}.`,
                );

            const { valid, status } = verifyPostMessage(
                body,
                this.secret,
                hubSignature!,
                link!,
            );

            if (!valid) {
                this.emit("invalidMessage", req);
                return res.status(status).send();
            }

            const message: WebSubMessage = new XMLParser({
                ignoreAttributes: false,
                attributesGroupName: XML_FEED_ATTRIBUTES,
            }).parse(body);
            this.emit("message", message);

            if ("at:deleted-entry" in (message.feed as DeletedFeed)) {
                const {
                    feed: { "at:deleted-entry": entry },
                } = message as { feed: DeletedFeed };

                const {
                    "@attributes": { ref, when },
                    "at:by": author,
                } = entry;

                this.emit("entryDeleted", {
                    videoId: ref.split(":")[2], // ref format is yt:video:[id]
                    when: new Date(when),
                    channelId: author?.uri.split("/")[4]!, // URI format is https//youtube.com/channel/[id]
                });
            } else {
                const {
                    feed: { entry },
                } = message as { feed: Feed };
                const {
                    "yt:channelId": channelId,
                    author: { name: channelName },
                    "yt:videoId": videoId,
                    title,
                    published,
                    updated,
                } = entry;

                const eventName =
                    published === updated ? "entryAdded" : "entryUpdated";

                const payload: EntryPayload = {
                    channelId,
                    channelName,
                    videoId,
                    title,
                    published: new Date(published),
                    updated: new Date(updated),
                };

                this.emit(eventName, payload);
                this.emit("feedModified", payload);
            }

            res.status(200).send();
        };
    }

    private async _doSubscribe(
        mode: Mode,
        channelId: string,
    ): Promise<Result<void, Error>> {
        try {
            const promise = new Promise<Result<void, Error>>(
                (resolve, reject) => {
                    this.pending.set(`${mode}:${channelId}`, resolve);

                    setTimeout(() => {
                        reject(
                            new Error(
                                `Verification for ${channelId} timed out.`,
                            ),
                        );
                    }, this.timeout);
                },
            );

            request(EVENTSUB_HUB_URL, {
                method: "POST",
                query: {
                    "hub.mode": mode,
                    "hub.topic": `${EVENTSUB_TOPIC}?channel_id=${channelId}`,
                    "hub.verify": "async",
                    "hub.callback": this.callbackUrl,
                    "hub.secret": this.secret,
                },
            });

            return promise;
        } catch (error) {
            return err(error as Error);
        }
    }

    /**
     * Emitted when {@linkcode messageHandler} or {@linkcode verificationHandler} receive invalid requests, indicating someone other than the hub is trying to request from that route.
     * @event
     */
    public on(
        eventName: "invalidMessage",
        listener: WebSubClientEvents["invalidMessage"],
    ): this;
    /**
     * Emitted when the {@linkcode verificationHandler} receives a valid request.
     * @event
     */
    public on(
        eventName: "verified",
        listener: WebSubClientEvents["verified"],
    ): this;
    /**
     * Emitted when the {@linkcode verificationHandler} receives a `denied` request, indicated that a subscription request to the hub was malformed.
     * @event
     */
    public on(
        eventName: "denied",
        listener: WebSubClientEvents["denied"],
    ): this;
    /**
     * Emitted when a subscribe request is successful.
     * @event
     */
    public on(
        eventName: "subscribed",
        listener: WebSubClientEvents["subscribed"],
    ): this;
    /**
     * Emitted when an unsubscribe request is successful.
     * @event
     */
    public on(
        eventName: "unsubscribed",
        listener: WebSubClientEvents["unsubscribed"],
    ): this;
    /**
     * Emitted whenever the client receives a valid notification.
     * @event
     */
    public on(
        eventName: "message",
        listener: WebSubClientEvents["message"],
    ): this;
    /**
     * Emitted when a channel has deleted a video.
     * @event
     */
    public on(
        eventName: "entryDeleted",
        listener: WebSubClientEvents["entryDeleted"],
    ): this;
    /**
     * Emitted when a channel has added a video (this can be a reservation, an upload, etc.)
     * @event
     */
    public on(
        eventName: "entryAdded",
        listener: WebSubClientEvents["entryAdded"],
    ): this;
    /**
     * Emitted when a channel has updated an already existing video.
     * @event
     */
    public on(
        eventName: "entryUpdated",
        listener: WebSubClientEvents["entryUpdated"],
    ): this;
    /**
     * Emitted alongside `entryAdded` and `entryUpdated` as a catch-all event.
     * @event
     */
    public on(
        eventName: "feedModified",
        listener: WebSubClientEvents["feedModified"],
    ): this;

    /**
     * Emitted when an unexpected `Error` is thrown.
     * @event
     */
    public on(
        eventName: "error",
        listener: WebSubClientEvents["error"],
    ): this;

    /**
     * Add a listener to this emitter that is called when the corresponding event is emitted.
     */
    public override on<T extends keyof WebSubClientEvents>(
        eventName: T,
        listener: WebSubClientEvents[T],
    ): this {
        return super.on(eventName, listener);
    }

    public async subscribe(channelId: string): Promise<Result<void, Error>> {
        return this._doSubscribe("subscribe", channelId);
    }

    public async unsubscribe(channelId: string): Promise<Result<void, Error>> {
        return this._doSubscribe("unsubscribe", channelId);
    }
}
