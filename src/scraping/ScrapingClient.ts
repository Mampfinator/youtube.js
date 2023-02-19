import { RequestOrchestrator } from "./RequestOrchestrator";
import { IRequestOrchestrator } from "./scraping.interfaces";
import { ContextFactory, ScrapingContext } from "./context";
import { Dispatcher } from "undici";

export interface ScrapingClientOptions {
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
}