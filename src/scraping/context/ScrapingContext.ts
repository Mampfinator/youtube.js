import { err, ok, Result } from "neverthrow";
import { Extractors } from "../extractors";
import { BROWSE_URL, CLIENT_API_KEY } from "../scraping.constants";
import { FetchError, IRequestOrchestrator } from "../scraping.interfaces";
import { YtInitialData } from "../types/internal";
import { BrowseResult } from "../types/internal/browse";

/**
 * Represents a page on YouTube. 
 * @template TData item this context extracts and returns.
 */
export abstract class ScrapingContext<TData extends object = {ytInitialData: YtInitialData}> {
    protected readonly data: TData;
    protected readonly body!: string;

    constructor(
        protected readonly orchestrator: IRequestOrchestrator,
        body: string,
        protected readonly url: string,
    ) {
        this.data = this.extract(body);

        Object.defineProperty(this, "body", {
            value: body, 
            enumerable: false
        });
    }


    /**
     * Extract data from the initial page for internal usage.
     * @param page
     * @virtual 
     */
    protected extract(body: string): TData {
        const result = Extractors.ytInitialData(body);
        if (result.isErr()) throw result.error;

        return {ytInitialData: result.value} as TData;
    };


    // TODO: figure out how to structure arguments
    /**
     * Makes a browse request with the given parameters. 
     * @template TReturn specifies return type.
     */
    protected async browse<TReturn extends BrowseResult>(args: any): Promise<TReturn> {
        const data = await this.orchestrator.fetch({
            method: "POST",
            url: BROWSE_URL,
            query: {
                key: CLIENT_API_KEY
            },
            transform: (body: string) => Result.fromThrowable(() => JSON.parse(body), (error) => error as Error)()
        });

        if (data.isErr()) throw data.error;
        return data.value as unknown as TReturn;
    }
}