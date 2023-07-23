import { VideosEndpoints } from "./videos/videos";
import { Client, Dispatcher } from "undici";
import { Result } from "neverthrow";
import { YouTubeAPIError } from "./errors";
import { ChannelsEndpoints } from "./channels/channels";
interface GetOptions {
    query?: Record<string, string | string[] | number | boolean | undefined>;
    headers?: Record<string, string | undefined>;
}
interface FetchOptions {
    path: string;
    method: Dispatcher.HttpMethod;
    query?: Record<string, string | string[] | number | boolean>;
    headers?: Record<string, string | string[]>;
    body?: Record<string, any>;
}
export interface ClientOptions {
    /**
     * API key to use for requests.
     */
    key?: string;
    /**
     * If using pubsub, URL to use for message callback.
     */
    callbackUrl?: string;
}
/**
 * YouTube client for all your needs.
 *
 * @example
 * ```ts
 * const client = new YouTubeClient({key: process.env.YOUTUBE_API_KEY})
 * ```
 */
export declare class YouTubeClient extends Client {
    readonly videos: VideosEndpoints;
    readonly channels: ChannelsEndpoints;
    private readonly key?;
    private readonly callbackUrl?;
    constructor(options: ClientOptions);
    protected fetch<T extends object>(options: FetchOptions): Promise<Result<T, YouTubeAPIError>>;
    get<T extends object>(path: string, options?: GetOptions): Promise<Result<T, YouTubeAPIError>>;
}
export {};
