import { RequestOrchestrator } from "./RequestOrchestrator";
import { IRequestOrchestrator } from "./scraping.interfaces";
import { ContextFactory, VideoPlayerContext } from "./context";
import { ChannelScraper, ChannelScraperOptions } from "./ChannelScraper";
import { PostScraper } from "./PostScraper";
import { Type } from "../shared/types";
import { ChatClient } from "./ChatClient";

export interface ScrapingClientOptions {
    /**
     * If provided, overrides the default request orchestrator that is responsible for all scraping-related fetching.
     * See the [notes](https://github.com/Mampfinator/youtube.js/wiki/Scraping#implementing-your-own-requestorchestrator) about implementing your own orchestrator in the wiki.
     */
    useOrchestrator?: IRequestOrchestrator;
}

export class ScrapingClient {
    public readonly orchestrator: IRequestOrchestrator;
    public readonly contexts: ContextFactory;

    constructor(options?: ScrapingClientOptions) {
        this.orchestrator =
            options?.useOrchestrator ?? new RequestOrchestrator();
        this.contexts = new ContextFactory(this.orchestrator);
    }

    /**
     * Initializes the client (and the request orchestrator). Needs to be called before anything else.
     */
    public async init(): Promise<void> {
        const orchestatorInit = await this.orchestrator.init?.();
        if (orchestatorInit && orchestatorInit.isErr()) {
            throw orchestatorInit.error;
        }
    }

    /**
     * Cleans up and calls `destroy` on the orchestrator, if present.
     */
    public async destroy(): Promise<void> {
        await this.orchestrator.destroy?.();
    }

    /**
     * @returns - a collection of channel-specific methods.
     */
    public channel(options: ChannelScraperOptions): ChannelScraper {
        return new ChannelScraper(this.contexts, options);
    }

    /**
     * @returns - a collection of community post-specific methods.
     */
    public post(id: string): PostScraper {
        return new PostScraper(this.contexts, id);
    }

    public async chat(streamId: string): Promise<ChatClient> {
        return ChatClient.fromStreamId(this, streamId);
    }
}
