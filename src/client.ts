import { API_BASE_URL } from "./constants";
import { VideosEndpoints } from "./videos/videos";
import { Client, Dispatcher } from "undici";
import { join } from "path";
import { err, ok, Result } from "neverthrow";
import { APIErrorResponse, isError, YouTubeAPIError } from "./errors";
import { deepClearRecord } from "./util/util";

interface GetOptions {
    query?: Record<string, string | string[] | undefined>;
    headers?: Record<string, string | undefined>;
}

interface FetchOptions {
    path: string;
    method: Dispatcher.HttpMethod;
    query?: Record<string, string | string[]>;
    headers?: Record<string, string | string[]>;
    body?: Record<string, any>;
}




export interface ClientOptions {

}

/**
 * YouTube client for all your needs.
 * 
 * @example
 * ```ts
 * const client = new YouTubeClient({key: process.env.YOUTUBE_API_KEY})
 * ```
 */
export class YouTubeClient extends Client {
    public readonly videos = new VideosEndpoints(this);


    constructor(
        private readonly key: string
    ) {
        super(API_BASE_URL);
    }

    protected async fetch<T extends object>(options: FetchOptions): Promise<Result<T, YouTubeAPIError>> {
        const response = await this.request({
            ...options, 
            query: options.query ? {key: this.key, ...options.query} : {},
            body: options.body ? JSON.stringify(options.body) : null, 
            path: `/${join("youtube", "v3" /* should be a constant, but YouTube will never update their API anyway- */, options.path)}`
        });
        
        if (isError(response.statusCode)) {
            const body: APIErrorResponse = await response.body.json();

            return err(new YouTubeAPIError(body));
        }


        return ok(await response.body.json() as T); 
    }


    public async get<T extends object>(path: string, options?: GetOptions): Promise<Result<T, YouTubeAPIError>> {
        return this.fetch({
            path,
            method: "GET",
            ...(deepClearRecord(options as Record<string, Record<string, any>> ?? {})), // this is a bodge, but it works for now
        });
    }
}