import { Result } from "neverthrow";
import { IRequestOrchestrator } from "../scraping.interfaces";
import { YtInitialData } from "../types/internal";
import { BrowseResult } from "../types/internal/browse";
import { ContextOptions } from "./ContextFactory";
interface BrowseParameters {
    useEndpoint?: string;
    token?: string;
    clickTrackingParams: any;
    visitorData: string;
    originalUrl?: string;
    playerOffsetMs?: string;
}
/**
 * Represents a page on YouTube.
 * @template TData item this context extracts and returns.
 */
export declare abstract class ScrapingContext<TData extends {
    ytInitialData: YtInitialData;
} = {
    ytInitialData: YtInitialData;
}> {
    protected readonly data: TData;
    protected readonly body: string;
    protected readonly url: string;
    protected readonly orchestrator: IRequestOrchestrator;
    constructor(options: ContextOptions);
    /**
     * Extract data from the initial page for internal usage.
     * @param page
     * @virtual
     */
    protected extract(body: string): TData;
    /**
     * Makes a browse request with the given parameters.
     * @template TReturn specifies return type.
     */
    protected browse<TReturn extends BrowseResult = BrowseResult>(options: BrowseParameters): Promise<Result<TReturn, Error>>;
    protected getVisitorData(): string;
}
export {};
