import { ok, err, Result } from "neverthrow";
import { ChannelTabBuilder, URLBuilder } from "../shared/builders/URLBuilder";
import { Awaitable, RequireOnlyOne, Type } from "../shared/types";
import {
    CommunityContext,
    ContextFactory,
    ElementContext,
    ShortsContext,
    StreamsContext,
    VideosContext,
} from "./context";
import { ChannelTab } from "./context/ChannelTabContexts/ChannelTabContext";
import { FetchError } from "./FetchError";

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

// TODO cache contexts and switch internally.
export class ChannelScraper {
    private readonly builder: ChannelTabBuilder;

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

    private async fetchElements<T extends ElementContext<any>>(
        tab: ChannelTab,
        useContext: Type<T>,
    ): Promise<
        Result<
            MapValueType<ReturnType<T["get"]>>[],
            FetchError | Error | Error[]
        >
    > {
        const context = await this.factory.fromUrl(
            this.builder.tab(tab).build(),
            useContext,
        );
        if (context.isErr()) return err(context.error);

        const fetchResult = await context.value.fetchAll();
        if (fetchResult.isErr()) return err(fetchResult.error);

        return ok([...context.value.get().values()]);
    }

    public async fetchPosts() {
        return this.fetchElements(ChannelTab.Community, CommunityContext);
    }

    public async fetchShorts() {
        return this.fetchElements(ChannelTab.Shorts, ShortsContext);
    }

    public async fetchStreams() {
        return this.fetchElements(ChannelTab.Streams, StreamsContext);
    }

    public async fetchVideos() {
        return this.fetchElements(ChannelTab.Videos, VideosContext);
    }

    /**
     * Fetches *all* videos (from `/videos`, `/shorts` and `/streams`).
     * @returns the fetched videos. If a property is undefined, its fetching errors appear in `errors`.
     */
    public async fetchAllVideos(): Promise<{shorts?: ReturnHelper<"fetchShorts">, streams?: ReturnHelper<"fetchStreams">, videos?: ReturnHelper<"fetchVideos">, errors: Error[]}> {
        const shorts = await this.fetchShorts();
        const streams = await this.fetchStreams(); 
        const videos = await this.fetchVideos();

        const ret: Awaited<ReturnType<ChannelScraper["fetchAllVideos"]>> = { errors: [] };

        if (shorts.isOk()) ret.shorts = shorts.value;
        else ret.errors.push(...(Array.isArray(shorts.error) ? shorts.error : [shorts.error]));
        if (streams.isOk()) ret.streams = streams.value;
        else ret.errors.push(...(Array.isArray(streams.error) ? streams.error : [streams.error]));
        if (videos.isOk()) ret.videos = videos.value;
        else ret.errors.push(...(Array.isArray(videos.error) ? videos.error : [videos.error]));

        return ret;
    }
}

type ReturnHelper<TKey extends keyof ChannelScraper> = ChannelScraper[TKey] extends ((...args: any[]) => Awaitable<Result<infer V, any>>) ? V : never;
