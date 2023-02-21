import { ok, err, Result } from "neverthrow";
import { ChannelTabBuilder, URLBuilder } from "../shared/builders/URLBuilder"
import { RequireOnlyOne } from "../shared/types"
import { CommunityContext, ContextFactory, ShortsContext } from "./context";
import { ChannelTab } from "./context/ChannelTabContexts/ChannelTabContext";
import { FetchError } from "./scraping.interfaces";
import { ScrapedShort } from "./types";
import { CommunityPost } from "./types/external/community-posts";

export type ChannelScraperOptions = RequireOnlyOne<{
    tag: string;
    id: string;
    vanityUrl: string;
}>;

// TODO cache contexts and switch internally.
export class ChannelScraper {
    private readonly builder: ChannelTabBuilder;

    constructor(
        private readonly factory: ContextFactory,
        options: ChannelScraperOptions
    ) {
        const entries = Object.entries(options) as [["tag" | "id" | "vanityUrl", string]];
        if (entries.length > 1) throw new TypeError(`Expected only one option, got ${entries.length}: ${Object.keys(options).join(", ")}`);
        const [[key, value]] = entries;
        this.builder = URLBuilder.channel()[key](value);
    }

    public async fetchPosts(): Promise<Result<CommunityPost[], FetchError | Error | Error[]>> {
        const result = await this.factory.fromUrl(this.builder.tab(ChannelTab.Community).build(), CommunityContext);
        if (result.isErr()) return err(result.error);
        
        const context = result.value;
        
        const fetchResult = await context.fetchAll();
        if (fetchResult.isErr()) return err(fetchResult.error);
        return ok([...context.get().values()]);
    }

    public async fetchShorts(): Promise<Result<ScrapedShort[], FetchError | Error | Error[]>> {
        const context = await this.factory.fromUrl(this.builder.tab(ChannelTab.Shorts).build(), ShortsContext);
        if (context.isErr()) return err(context.error);
        
        
        const fetchResult = await context.value.fetchAll();
        if (fetchResult.isErr()) return err(fetchResult.error);
        return ok([...context.value.get().values()]);
    }
}