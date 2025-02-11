import { IRequestOrchestrator } from "./scraping.interfaces";
import { ContextFactory } from "./context";
import { ChannelScraper, ChannelScraperOptions } from "./ChannelScraper";
import { PostScraper } from "./PostScraper";
import { ChatClient } from "./ChatClient";
export interface ScrapingClientOptions {
    /**
     * If provided, overrides the default request orchestrator that is responsible for all scraping-related fetching.
     * See the [notes](https://github.com/Mampfinator/youtube.js/wiki/Scraping#implementing-your-own-requestorchestrator) about implementing your own orchestrator in the wiki.
     */
    useOrchestrator?: IRequestOrchestrator;
}
export declare class ScrapingClient {
    readonly orchestrator: IRequestOrchestrator;
    readonly contexts: ContextFactory;
    constructor(options?: ScrapingClientOptions);
    /**
     * Initializes the client (and the request orchestrator). Needs to be called before anything else.
     */
    init(): Promise<void>;
    /**
     * Cleans up and calls `destroy` on the orchestrator, if present.
     */
    destroy(): Promise<void>;
    /**
     * @returns - a collection of channel-specific methods.
     */
    channel(options: ChannelScraperOptions): ChannelScraper;
    /**
     * @returns - a collection of community post-specific methods.
     */
    post(id: string): PostScraper;
    chat(streamId: string): Promise<ChatClient>;
}
