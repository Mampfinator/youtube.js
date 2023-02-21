import { RequestOrchestrator } from "./RequestOrchestrator";
import { IRequestOrchestrator } from "./scraping.interfaces";
import { ContextFactory, ScrapingContext } from "./context";
import { Dispatcher } from "undici";
import { ChannelScraper, ChannelScraperOptions } from "./ChannelScraper";
import { PostScraper } from "./PostScraper";

export interface ScrapingClientOptions {
    /**
     * If provided, overrides the default request orchestrator that is responsible for all scraping-related fetching.
     * See the [notes](https://github.com/Mampfinator/youtube.js/wiki/Scraping#implementing-your-own-requestorchestrator) about implementing your own orchestrator in the wiki.
     */
    useOrchestrator?: IRequestOrchestrator;
}


export class ScrapingClient {
    public readonly orchestrator: IRequestOrchestrator;
    private readonly contextFactory: ContextFactory;

    constructor(
        options?: ScrapingClientOptions
    ) {
        this.orchestrator = options?.useOrchestrator ?? new RequestOrchestrator();
        this.contextFactory = new ContextFactory(this.orchestrator);
    }

    public async contextFromUrl<T extends ScrapingContext>(url: string, method?: Dispatcher.HttpMethod) {
        return this.contextFactory.fromUrl<T>(url, method);
    }

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

    public channel(options: ChannelScraperOptions): ChannelScraper {
        return new ChannelScraper(this.contextFactory, options);
    }

    public post(id: string): PostScraper {
        return new PostScraper(this.contextFactory, id);
    }
}