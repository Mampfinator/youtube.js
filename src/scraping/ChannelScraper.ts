import { ok, err, Result, Err } from "neverthrow";
import { ChannelTabBuilder, URLBuilder } from "../shared/builders/URLBuilder";
import { Awaitable, RequireOnlyOne, Type } from "../shared/types";
import {
    CommunityContext,
    ContextFactory,
    ElementContext,
    FeaturedContext,
    ShortsContext,
    StreamsContext,
    VideosContext,
} from "./context";
import {
    ChannelTab,
    ChannelTabContext,
} from "./context/ChannelTabContexts/ChannelTabContext";
import { FetchError, FetchErrorCode } from "./errors/FetchError";
import { ChannelData } from "./types";
import { RECENT_LIMIT } from "./scraping.constants";

export type ChannelScraperOptions = RequireOnlyOne<{
    tag: string;
    id: string;
    vanityUrl: string;
}>;

type MapValueType<TMap extends Map<unknown, unknown>> = TMap extends Map<
    any,
    infer Value
>
    ? Value
    : any;

/**
 * Represents a channel as seen on the YouTube website.
 */
// TODO cache contexts and switch internally.
export class ChannelScraper {
    private readonly builder: ChannelTabBuilder;
    private lastContext?: ChannelTabContext;

    constructor(
        private readonly factory: ContextFactory,
        options: ChannelScraperOptions,
    ) {
        const entries = Object.entries(options) as [
            ["tag" | "id" | "vanityUrl", string],
        ];
        if (entries.length > 1)
            throw new TypeError(
                `Expected only one option, got ${entries.length}: ${Object.keys(
                    options,
                ).join(", ")}`,
            );
        const [[key, value]] = entries;
        this.builder = URLBuilder.channel()[key](value);
    }

    /**
     * Navigates to a specific tab on the channel.
     */
    async navigate<T extends ChannelTab>(): Promise<void> {}

    private async fetchElements<
        T extends ElementContext<any> & ChannelTabContext,
    >(
        tab: ChannelTab,
        useContext: Type<T>,
        limit?: number,
    ): Promise<Result<MapValueType<ReturnType<T["get"]>>[], FetchError>> {
        const context = await this.factory.fromUrl(
            this.builder.tab(tab).build(),
            useContext,
        );
        if (context.isErr()) return err(context.error);

        this.lastContext = context.value;

        const fetchResult = await context.value.fetchElements(limit);
        if (fetchResult.isErr())
            return err(
                new FetchError(
                    FetchErrorCode.InternalError,
                    {},
                    fetchResult.error,
                ),
            );

        return ok([...context.value.get().values()]);
    }

    /**
     * @returns all posts from this channel.
     */
    public async fetchAllPosts() {
        return this.fetchElements(ChannelTab.Community, CommunityContext);
    }

    /**
     * @param recentOverride how many posts to fetch. Defaults to 15.
     * @returns the most recent posts on this channel, up to `recentOverrie`.
     */
    public async fetchRecentPosts(recentOverride?: number) {
        return this.fetchElements(
            ChannelTab.Community,
            CommunityContext,
            recentOverride ?? RECENT_LIMIT,
        );
    }

    /**
     * @returns all shorts from this channel.
     */
    public async fetchAllShorts() {
        return this.fetchElements(ChannelTab.Shorts, ShortsContext);
    }

    /**
     * @param recentOverride how many shorts to fetch. Defaults to 15.
     * @returns the most recent shorts on this channel, up to `recentOverrie`.
     */
    public async fetchRecentShorts(recentOverride?: number) {
        return this.fetchElements(
            ChannelTab.Shorts,
            ShortsContext,
            recentOverride ?? RECENT_LIMIT,
        );
    }

    /**
     * @returns all streams from this channel.
     */
    public async fetchAllStreams() {
        return this.fetchElements(ChannelTab.Streams, StreamsContext);
    }

    /**
     * @param recentOverride how many streams to fetch. Defaults to 15.
     * @returns the most recent streams on this channel, up to `recentOverrie`.
     */
    public async fetchRecentStreams(recentOverride?: number) {
        return this.fetchElements(
            ChannelTab.Streams,
            StreamsContext,
            recentOverride ?? RECENT_LIMIT,
        );
    }

    /**
     * @returns all uploads from this channel.
     */
    public async fetchAllVideos() {
        return this.fetchElements(ChannelTab.Videos, VideosContext);
    }

    /**
     * @param recentOverride how many videos to fetch. Defaults to 15.
     * @returns the most recent videos on this channel, up to `recentOverrie`.
     */
    public async fetchRecentVideos(recentOverride?: number) {
        return this.fetchElements(
            ChannelTab.Videos,
            VideosContext,
            recentOverride ?? RECENT_LIMIT,
        );
    }

    /**
     * Extracts the channel's metadata. Requires any `fetch` method to have been called previously.
     */
    public getChannelData(): Result<ChannelData, Error> {
        if (!this.lastContext)
            return err(
                new Error(
                    `To extract channel data, make any other request first!`,
                ),
            );

        return this.lastContext.getChannelData();
    }

    /**
     * Fetches **all** watchable content (from `/videos`, `/shorts` and `/streams`).
     * @returns the fetched videos. If a property is undefined, its fetching errors appear in `errors`.
     */
    public async fetchAll(): Promise<{
        shorts?: ReturnHelper<"fetchAllShorts">;
        streams?: ReturnHelper<"fetchAllStreams">;
        videos?: ReturnHelper<"fetchAllVideos">;
        errors: Error[];
    }> {
        const shorts = await this.fetchAllShorts();
        const streams = await this.fetchAllStreams();
        const videos = await this.fetchAllVideos();

        const ret: Awaited<ReturnType<ChannelScraper["fetchAll"]>> = {
            errors: [],
        };

        if (shorts.isOk()) ret.shorts = shorts.value;
        else
            ret.errors.push(
                ...(Array.isArray(shorts.error)
                    ? shorts.error
                    : [shorts.error]),
            );
        if (streams.isOk()) ret.streams = streams.value;
        else
            ret.errors.push(
                ...(Array.isArray(streams.error)
                    ? streams.error
                    : [streams.error]),
            );
        if (videos.isOk()) ret.videos = videos.value;
        else
            ret.errors.push(
                ...(Array.isArray(videos.error)
                    ? videos.error
                    : [videos.error]),
            );

        return ret;
    }

    public async fetchAbout() {
        if (!this.lastContext)
            return err(
                new Error(
                    `To fetch a channel about, make any other request first!`,
                ),
            );

        return this.lastContext.fetchAbout();
    }

    /**
     * @returns a list of channels this channel features.
     */
    public async fetchFeaturedChannels() {
        const context = await this.factory.fromUrl(
            this.builder.build(),
            FeaturedContext,
        );
        if (context.isErr()) return err(context.error);

        this.lastContext = context.value;

        return context.value.getFeaturedChannels();
    }
}

type ReturnHelper<TKey extends keyof ChannelScraper> =
    ChannelScraper[TKey] extends (
        ...args: any[]
    ) => Awaitable<Result<infer V, any>>
        ? V
        : never;
