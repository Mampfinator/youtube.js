import { sleep } from "../shared/util";
import { LiveChatContext, VideoPlayerContext } from "./context";
import { ScrapingClient } from "./ScrapingClient";
import { Action } from "./types";
import { AddChatItemActionItem, FluffyEmoji, PurpleEmoji, Thumbnail } from "./types/internal/messages";

export class ChatClient {
    private constructor(
        public readonly scraper: ScrapingClient,
        public readonly context: LiveChatContext,
        public readonly streamId: string,
        private readonly visitorData: string,
    ) {}

    /**
     * Attempt to instantiate a `ChatClient` from a stream ID. If the video is not a current or past live stream, or no video with the given ID exists,
     * an error will be thrown.
     */
    public static async fromStreamId(scraper: ScrapingClient, streamId: string): Promise<ChatClient> {
        const videoContext = await scraper.contexts.fromUrl(
            `https://youtube.com/watch?v=${streamId}`,
            VideoPlayerContext
        );

        if (videoContext.isErr()) throw videoContext.error;

        const [initialContinuation, visitorData] = videoContext.value.getLiveChatContinuation()!;

        if (initialContinuation === null) {
            throw new Error("Live chat not available");
        }

        const liveChatContext = await scraper.contexts.fromUrl(
            `https://youtube.com/live_chat?continuation=${initialContinuation}`,
            LiveChatContext,
        );

        if (liveChatContext.isErr()) throw liveChatContext.error;

        return new ChatClient(scraper, liveChatContext.value, streamId, visitorData);
    }

    public async *readRaw() {
        for (const action of this.context.getInitialActions()) {
            yield action;
        }

        let {
            clickTrackingParams,
            continuation,
            timeoutMs,
        } = this.context.getInitialContinuation();

        while (true) {
            await sleep(timeoutMs);

            const result = await this.context.getLiveChat(continuation, clickTrackingParams, this.visitorData);
            if (result.isErr()) throw result.error;
            
            for (const action of (result.value as any).continuationContents.liveChatContinuation.actions) {
                yield action;
            }

            const { clickTrackingParams: nextClickTrackingParams, continuation: nextContinuation, timeoutMs: nextTimeoutMs } =
                (result.value as any).continuationContents.liveChatContinuation.continuations[0].invalidationContinuationData;

            clickTrackingParams = nextClickTrackingParams;
            continuation = nextContinuation;
            timeoutMs = nextTimeoutMs;
        }
    }

    public async *read(): AsyncGenerator<ChatMessage> {
        for await (const rawMessage of this.readRaw()) {
            const converted = this.convertAction(rawMessage);
            if (converted) yield converted;
        }
    }

    private convertAction(action: Action): ChatMessage | undefined {
        if (!action.addChatItemAction) return undefined;
        
        const { addChatItemAction: {item} } = action;

        const actionType = Object.keys(item)[0] as NonNullable<keyof AddChatItemActionItem>;

        // TODO: find and convert sticker renderers

        if (actionType === "liveChatMembershipItemRenderer") {
            const {
                id,
                timestampUsec,
                authorExternalChannelId,
                message,
                authorName: { simpleText: authorName },
                authorPhoto,
            } = item[actionType]!;

            return {
                type: MessageType.Membership,
                timestamp: Number(timestampUsec),
                id,
                authorName,
                authorAvatar: authorPhoto.thumbnails.at(-1)!.url,
                authorId: authorExternalChannelId,
                message: message ? new MessageContent(message.runs) : undefined,
            }
        } else if (actionType === "liveChatPaidMessageRenderer") {
            const {
                id,
                timestampUsec,
                authorName: { simpleText: authorName },
                authorPhoto,
                authorExternalChannelId,
                purchaseAmountText: { simpleText: amountText },
                message,
                bodyBackgroundColor,
                bodyTextColor,
                authorNameTextColor,
            } = item[actionType]!;

            const amount = Number(amountText.match(/\d+/)![0]);
            const currency = amountText.match(/[^\d]+/)![0].trim();

            return {
                type: MessageType.SuperChat,
                id,
                timestamp: Number(timestampUsec),
                authorName,
                authorAvatar: authorPhoto.thumbnails.at(-1)!.url,
                authorId: authorExternalChannelId,
                amount, currency,
                message: message ? new MessageContent(message.runs) : undefined,
                backgroundColor: bodyBackgroundColor,
                textColor: bodyTextColor,
                authorColor: authorNameTextColor,
            }
        }
    }
}

export type MessageContentRun = {
    text?: string,
    url?: string,
    emoji?: FluffyEmoji,
}

export class MessageContent {
    constructor(public readonly runs: MessageContentRun[]) {}

    public get simpleText() {
        return this.runs.map(run => run.text).join(" ");
    }

    public get html() {
        return this.runs.map(run => {
            if ("emoji" in run) {
                const image = run.emoji!.image.thumbnails.at(-1)!;

                return `<img alt="${run.text}" src=${image.url}></img>` 
            } else if ("url" in run) {
                return `<a href="${run.url}">${run.text}</a>`
            } else {
                return `<span>${run.text}</span>`
            }
        }).join("");
    }
}

export enum MessageType {
    SuperChat = "SuperChat",
    SuperSticker = "SuperSticker",
    Membership = "Membership",
}

type BaseMessage = {
    id: string,
    authorName: string,
    authorAvatar: string,
    authorId: string,
    timestamp: number,
}


export type SuperChat = BaseMessage & {
    type: MessageType.SuperChat,
    amount: number,
    currency: string,
    backgroundColor: number,
    textColor: number,
    authorColor: number,
    message?: MessageContent,
}

export type SuperSticker = BaseMessage & {
    type: MessageType.SuperSticker,
    sticker: string,
    color: string,
}

export type Membership = BaseMessage & {
    type: MessageType.Membership,
    message?: MessageContent,
};

export type ChatMessage = SuperChat | SuperSticker | Membership;