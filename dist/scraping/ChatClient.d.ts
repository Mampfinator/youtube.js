import { LiveChatContext } from "./context";
import { ScrapingClient } from "./ScrapingClient";
import { Action } from "./types";
import { FluffyEmoji } from "./types/internal/messages";
export declare class ChatClient {
    readonly scraper: ScrapingClient;
    readonly context: LiveChatContext;
    readonly streamId: string;
    private readonly visitorData;
    private constructor();
    /**
     * Attempt to instantiate a `ChatClient` from a stream ID. If the video is not a current or past live stream, or no video with the given ID exists,
     * an error will be thrown.
     */
    static fromStreamId(scraper: ScrapingClient, streamId: string): Promise<ChatClient>;
    readRaw(): AsyncGenerator<Action, void, unknown>;
    read(): AsyncGenerator<ChatMessage>;
    private convertAction;
}
export type MessageContentRun = {
    text?: string;
    url?: string;
    emoji?: FluffyEmoji;
};
export declare class MessageContent {
    readonly runs: MessageContentRun[];
    constructor(runs: MessageContentRun[]);
    get simpleText(): string;
    get html(): string;
}
export declare class Author {
    readonly name: string;
    readonly channelId: string;
    readonly avatarUrl: string;
    constructor(name: string, channelId: string, avatar: string | {
        url: string;
    }[]);
    get channelUrl(): string;
}
export declare enum MessageType {
    SuperChat = "SuperChat",
    SuperSticker = "SuperSticker",
    Membership = "Membership"
}
type BaseMessage = {
    id: string;
    author: Author;
    timestamp: number;
};
export type SuperChat = BaseMessage & {
    type: MessageType.SuperChat;
    amount: number;
    currency: string;
    backgroundColor: number;
    textColor: number;
    authorColor: number;
    message?: MessageContent;
};
export type SuperSticker = BaseMessage & {
    type: MessageType.SuperSticker;
    sticker: string;
    backgroundColor: number;
};
export type Membership = BaseMessage & {
    type: MessageType.Membership;
    message?: MessageContent;
};
export type ChatMessage = SuperChat | SuperSticker | Membership;
export {};
