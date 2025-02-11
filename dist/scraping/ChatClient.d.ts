import { LiveChatContext } from "./context";
import { ScrapingClient } from "./ScrapingClient";
export type ChatMessage = {};
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
    read(): AsyncGenerator<any, void, unknown>;
}
export type StripAction<T> = T extends `liveStream${infer Action}Action` ? Action : T;
