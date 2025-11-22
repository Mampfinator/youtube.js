import { sleep } from "../shared/util";
import { LiveChatContext, VideoPlayerContext, VideoStatus } from "./context";
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

        // FIXME: this is currently getting the wrong continuation!
        const [initialContinuation, visitorData] = videoContext.value.getLiveChatContinuation()!;

        if (initialContinuation === null) {
            throw new Error("Live chat not available");
        }

        const isLive = videoContext.value.getStatus() === VideoStatus.Live;

        const url = `https://youtube.com/live_chat${isLive ? "" : "_replay"}?continuation=${initialContinuation.continuation}`;

        const liveChatContext = await scraper.contexts.fromUrl(
            url,
            LiveChatContext,
        );

        if (liveChatContext.isErr()) throw liveChatContext.error;

        liveChatContext.value.setIsLive(isLive);

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

        let playerOffsetMs = 0;

        while (true) {
            await sleep(timeoutMs);
            playerOffsetMs += timeoutMs;

            const result = await this.context.getLiveChat(continuation, clickTrackingParams, this.visitorData, this.context.getIsLive() ? playerOffsetMs : undefined);
            if (result.isErr()) throw result.error;
            
            const { liveChatContinuation } = (result.value as any).continuationContents;
            // no continuation = stream has ended
            if (!liveChatContinuation) return;

            const actions: Action[] | undefined = liveChatContinuation.actions;
            if (!actions) continue;
            
            for (const action of actions) {
                yield action;
            }

            const continuationContainer = (result.value as any).continuationContents.liveChatContinuation.continuations[0];

            const { clickTrackingParams: nextClickTrackingParams, continuation: nextContinuation, timeoutMs: nextTimeoutMs } =
                continuationContainer[Object.keys(continuationContainer)[0]];

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
        if ((action as any).replayChatItemAction) {
            action = (action as any).replayChatItemAction.actions[0];
        }

        if (!action.addChatItemAction && !(action as any).chatReplayItemAction) return undefined;
        
        const item: AddChatItemActionItem = (action as any).addChatItemAction?.item;

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
                author: new Author(authorName, authorExternalChannelId, authorPhoto.thumbnails),
                message: message && message.runs?.length > 0 ? new MessageContent(message.runs) : undefined,
            }
        } else if (actionType === "liveChatPaidMessageRenderer") {
            const {
                id,
                timestampUsec,
                authorName: { simpleText: authorName },
                authorPhoto,
                authorExternalChannelId,
                purchaseAmountText: { simpleText: currencyString },
                message,
                bodyBackgroundColor,
                bodyTextColor,
                authorNameTextColor,
            } = item[actionType]!;

            return {
                type: MessageType.SuperChat,
                id,
                timestamp: Number(timestampUsec),
                author: new Author(authorName, authorExternalChannelId, authorPhoto.thumbnails),
                currencyString,
                message: message && message.runs?.length > 0 ? new MessageContent(message.runs) : undefined,
                backgroundColor: bodyBackgroundColor,
                textColor: bodyTextColor,
                authorColor: authorNameTextColor,
            }
        } else if (actionType === "liveChatPaidStickerRenderer") {
            const {
                id,
                timestampUsec,
                authorName: { simpleText: authorName },
                authorPhoto,
                authorExternalChannelId,
                sticker,
                backgroundColor,
                purchaseAmountText: { simpleText: currencyString },
            } = item[actionType]!;

            return {
                type: MessageType.SuperSticker,
                id,
                timestamp: Number(timestampUsec),
                author: new Author(authorName, authorExternalChannelId, authorPhoto.thumbnails),
                sticker: sticker.thumbnails.at(-1)!.url,
                backgroundColor,
                currencyString,
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
        return this.runs.map(run => {
            if ("emoji" in run) {
                return `:${run.emoji!.shortcuts[0]}:`;
            } else if ("url" in run) {
                return `[${run.text}](${run.url})`
            } else {
                return run.text!; 
            }
        }).join(" ");
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


// TODO: badges
export class Author {
    public readonly avatarUrl: string;

    constructor(
        public readonly name: string,
        public readonly channelId: string,
        avatar: string | { url: string}[]
    ) {
        if (typeof avatar === "string") {
            this.avatarUrl = avatar;
        } else {
            this.avatarUrl = avatar.at(-1)!.url
        }
    }

    public get channelUrl() {
        return `https://www.youtube.com/channel/${this.channelId}`;
    }
}

export enum MessageType {
    SuperChat = "SuperChat",
    SuperSticker = "SuperSticker",
    Membership = "Membership",
}

type BaseMessage = {
    id: string,
    author: Author,
    timestamp: number,
}

export type SuperChat = BaseMessage & {
    type: MessageType.SuperChat,
    /**
     * The combined amount and currency that was donated with the superchat.
     */
    currencyString: string,
    backgroundColor: number,
    textColor: number,
    authorColor: number,
    message?: MessageContent,
}

export type SuperSticker = BaseMessage & {
    type: MessageType.SuperSticker,
    sticker: string,
    backgroundColor: number,
    /**
     * The combined amount and currency that was donated with the super sticker.
     */
    currencyString: string,
}

// TODO: tiers
export type Membership = BaseMessage & {
    type: MessageType.Membership,
    message?: MessageContent,
};

export type ChatMessage = SuperChat | SuperSticker | Membership;