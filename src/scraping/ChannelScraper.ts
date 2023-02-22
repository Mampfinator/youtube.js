import { ok, err, Result } from "neverthrow";
import { ChannelTabBuilder, URLBuilder } from "../shared/builders/URLBuilder";
import { RequireOnlyOne, Type } from "../shared/types";
import {
    CommunityContext,
    ContextFactory,
    ElementContext,
    ShortsContext,
    StreamsContext,
    VideosContext,
} from "./context";
import { ChannelTab } from "./context/ChannelTabContexts/ChannelTabContext";
import { FetchError } from "./scraping.interfaces";

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
}
