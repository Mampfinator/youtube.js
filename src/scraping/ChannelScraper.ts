import { ok, err, Result } from "neverthrow";
import { ChannelTabBuilder, URLBuilder } from "../shared/builders/URLBuilder";
import { Awaitable, RequireOnlyOne, Type } from "../shared/types";
import {
    ChannelsContext,
    CommunityContext,
    ContextFactory,
    ElementContext,
    ShortsContext,
    StreamsContext,
    VideosContext,
} from "./context";
import { ChannelTab, ChannelTabContext } from "./context/ChannelTabContexts/ChannelTabContext";
import { FetchError, FetchErrorCode } from "./errors/FetchError";
import { ChannelData } from "./types";

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

    private async fetchElements<T extends (ElementContext<any> & ChannelTabContext)>(
        tab: ChannelTab,
        useContext: Type<T>,
    ): Promise<Result<MapValueType<ReturnType<T["get"]>>[], FetchError>> {
        const context = await this.factory.fromUrl(
            this.builder.tab(tab).build(),
            useContext,
        );
        if (context.isErr()) return err(context.error);
        
        this.lastContext = context.value;

        const fetchResult = await context.value.fetchAll();
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
    public async fetchPosts() {
        return this.fetchElements(ChannelTab.Community, CommunityContext);
    }

    /**
     * @returns all shorts from this channel.
     */
    public async fetchShorts() {
        return this.fetchElements(ChannelTab.Shorts, ShortsContext);
    }

    /**
     * @returns all streams from this channel.
     */
    public async fetchStreams() {
        return this.fetchElements(ChannelTab.Streams, StreamsContext);
    }

    /**
     * Not to be confused with {@linkcode fetchAllVideos}.
     * @returns all uploads from this channel.
     */
    public async fetchVideos() {
        return this.fetchElements(ChannelTab.Videos, VideosContext);
    }

    /**
     * Extracts the channel's metadata. Requires any `fetch` method to have been called previously.
     */
    public getChannelData(): Result<ChannelData, Error> {
        if (!this.lastContext) return err(new Error(`To extract channel data, make any other request first!`));

        return this.lastContext.getChannelData();
    }

    /**
     * Fetches **all** watchable content (from `/videos`, `/shorts` and `/streams`).
     * @returns the fetched videos. If a property is undefined, its fetching errors appear in `errors`.
     */
    public async fetchAll(): Promise<{
        shorts?: ReturnHelper<"fetchShorts">;
        streams?: ReturnHelper<"fetchStreams">;
        videos?: ReturnHelper<"fetchVideos">;
        errors: Error[];
    }> {
        const shorts = await this.fetchShorts();
        const streams = await this.fetchStreams();
        const videos = await this.fetchVideos();

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

    /**
     * @returns a list of channels this channel features.
     */
    public async fetchFeaturedChannels() {
        return this.fetchElements(ChannelTab.Channels, ChannelsContext);
    }
}

type ReturnHelper<TKey extends keyof ChannelScraper> =
    ChannelScraper[TKey] extends (
        ...args: any[]
    ) => Awaitable<Result<infer V, any>>
        ? V
        : never;
