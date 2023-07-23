import { Result } from "neverthrow";
import { Awaitable, RequireOnlyOne } from "../shared/types";
import { ContextFactory } from "./context";
import { FetchError } from "./errors/FetchError";
import { ChannelData } from "./types";
export type ChannelScraperOptions = RequireOnlyOne<{
    tag: string;
    id: string;
    vanityUrl: string;
}>;
/**
 * Represents a channel as seen on the YouTube website.
 */
export declare class ChannelScraper {
    private readonly factory;
    private readonly builder;
    private lastContext?;
    constructor(factory: ContextFactory, options: ChannelScraperOptions);
    private fetchElements;
    /**
     * @returns all posts from this channel.
     */
    fetchAllPosts(): Promise<Result<import("./types").CommunityPost[], FetchError<any>>>;
    /**
     * @param recentOverride how many posts to fetch. Defaults to 15.
     * @returns the most recent posts on this channel, up to `recentOverrie`.
     */
    fetchRecentPosts(recentOverride?: number): Promise<Result<import("./types").CommunityPost[], FetchError<any>>>;
    /**
     * @returns all shorts from this channel.
     */
    fetchAllShorts(): Promise<Result<import("./types").ScrapedShort[], FetchError<any>>>;
    /**
     * @param recentOverride how many shorts to fetch. Defaults to 15.
     * @returns the most recent shorts on this channel, up to `recentOverrie`.
     */
    fetchRecentShorts(recentOverride?: number): Promise<Result<import("./types").ScrapedShort[], FetchError<any>>>;
    /**
     * @returns all streams from this channel.
     */
    fetchAllStreams(): Promise<Result<import("./types").ScrapedStream[], FetchError<any>>>;
    /**
     * @param recentOverride how many streams to fetch. Defaults to 15.
     * @returns the most recent streams on this channel, up to `recentOverrie`.
     */
    fetchRecentStreams(recentOverride?: number): Promise<Result<import("./types").ScrapedStream[], FetchError<any>>>;
    /**
     * @returns all uploads from this channel.
     */
    fetchAllVideos(): Promise<Result<import("./types").ScrapedVideo[], FetchError<any>>>;
    /**
     * @param recentOverride how many videos to fetch. Defaults to 15.
     * @returns the most recent videos on this channel, up to `recentOverrie`.
     */
    fetchRecentVideos(recentOverride?: number): Promise<Result<import("./types").ScrapedVideo[], FetchError<any>>>;
    /**
     * Extracts the channel's metadata. Requires any `fetch` method to have been called previously.
     */
    getChannelData(): Result<ChannelData, Error>;
    /**
     * Fetches **all** watchable content (from `/videos`, `/shorts` and `/streams`).
     * @returns the fetched videos. If a property is undefined, its fetching errors appear in `errors`.
     */
    fetchAll(): Promise<{
        shorts?: ReturnHelper<"fetchAllShorts">;
        streams?: ReturnHelper<"fetchAllStreams">;
        videos?: ReturnHelper<"fetchAllVideos">;
        errors: Error[];
    }>;
    fetchAbout(): Promise<Result<import("./types").FullChannelData, Error>>;
    /**
     * @returns a list of channels this channel features.
     */
    fetchFeaturedChannels(): Promise<Result<import("./types").FeaturedChannelSection[], FetchError<any>>>;
}
type ReturnHelper<TKey extends keyof ChannelScraper> = ChannelScraper[TKey] extends (...args: any[]) => Awaitable<Result<infer V, any>> ? V : never;
export {};
