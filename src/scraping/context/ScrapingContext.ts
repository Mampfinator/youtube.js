import { err, ok, Result } from "neverthrow";
import { DataExtractors } from "../extractors/data-extractors";
import { BROWSE_URL, CLIENT_API_KEY, YOUTUBE_CLIENT_VERSION } from "../scraping.constants";
import { IRequestOrchestrator } from "../scraping.interfaces";
import { YtInitialData } from "../types/internal";
import { BrowseResult } from "../types/internal/browse";
import { ContextOptions } from "./ContextFactory";

interface BrowseParameters {
    token?: string;
    clickTrackingParams: any;
    visitorData: string;
    originalUrl?: string;
}

/**
 * Represents a page on YouTube. 
 * @template TData item this context extracts and returns.
 */
export abstract class ScrapingContext<TData extends {ytInitialData: YtInitialData} = {ytInitialData: YtInitialData}> {
    protected readonly data: TData;
    protected readonly body!: string;
    protected readonly url: string;
    protected readonly orchestrator: IRequestOrchestrator;

    constructor(
        options: ContextOptions
    ) {
        this.data = this.extract(options.body);
        this.url = options.url;
        this.orchestrator = options.orchestrator;

        Object.defineProperty(this, "body", {
            value: options.body, 
            enumerable: false
        });
    }


    /**
     * Extract data from the initial page for internal usage.
     * @param page
     * @virtual 
     */
    protected extract(body: string): TData {
        const result = DataExtractors.ytInitialData(body);
        if (result.isErr()) throw result.error;

        return {ytInitialData: result.value} as TData;
    };


    /**
     * Makes a browse request with the given parameters. 
     * @template TReturn specifies return type.
     */
    protected async browse<TReturn extends BrowseResult = BrowseResult>(options: BrowseParameters): Promise<Result<TReturn, Error>> {
        const {
            token, clickTrackingParams, visitorData, originalUrl
        } = options;

        const data = await this.orchestrator.fetch({
            method: "POST",
            url: BROWSE_URL,
            query: {
                key: CLIENT_API_KEY
            },
            headers: {
                "X-Youtube-Client-Name": "1",
                "X-Youtube-Client-Version": YOUTUBE_CLIENT_VERSION,
                "X-Youtube-Bootstrap-Logged-In": "false",
                "X-Goog-EOM-Visitor-Id": visitorData,
                Origin: "https://youtube.com",
                Host: "www.youtube.com",
            },
            body: {
                context: {
                    client: {
                        clientName: "WEB",
                        clientVersion: YOUTUBE_CLIENT_VERSION,
                        originalUrl: originalUrl ?? "https://youtube.com",
                        visitorData,
                    },
                    clickTracking: { clickTrackingParams }
                },
                continuation: token
            },
            transform: (body: string) => {
                if (typeof body === "string") return Result.fromThrowable(JSON.parse, (error) => error as Error)(body)
                return ok(body);
            }
        });

        if (data.isErr()) return err(data.error as Error);
        return ok(data.value as unknown as TReturn);
    }

    protected getVisitorData() {
        return this.data.ytInitialData.responseContext.webResponseContextExtensionData.ytConfigData.visitorData;
    }
}