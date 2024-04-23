import { Result } from "neverthrow";
import { YtInitialData } from "../../types";
import { ChannelData } from "../../types/external/channel";
import { MoreEndpoint, TabRenderer, TabRendererContent, TwoColumnBrowseResultsRenderer } from "../../types/internal/generated";
import { ScrapingContext } from "../ScrapingContext";
import type { ChannelContext } from "./helpers";
/**
 * matches
 * - `youtube.com/@handle`,
 * - `youtube.com/channel/id`,
 * - `youtube.com/c/vanityURL`
 */
export declare const CHANNEL_BASE_REGEX: RegExp;
export declare function getChannelTabRegex(tab: string): RegExp;
interface Tab<Active extends boolean = false> {
    endpoint: MoreEndpoint;
    selected: boolean;
    content: Active extends true ? TabRendererContent : undefined;
}
export declare enum ChannelTab {
    Featured = "featured",
    Videos = "videos",
    Shorts = "shorts",
    /**
     * aka "Live"
     */
    Streams = "streams",
    Releases = "releases",
    Playlists = "playlists",
    Podcasts = "podcasts",
    Community = "community",
    Store = "store",
    Search = "search"
}
/**
 * Base class for all channel tabs.
 */
export declare abstract class ChannelTabContext<TExtractData extends {
    ytInitialData: YtInitialData;
} = {
    ytInitialData: YtInitialData;
}> extends ScrapingContext<TExtractData> {
    private _tabData?;
    protected get tabData(): Result<TabData, Error>;
    private getTabData;
    protected getData(): Result<TabRenderer["content"], Error>;
    fetchAbout(): Promise<Result<AboutData, Error>>;
    /**
     * Navigates to the given tab, if it exists.
     */
    navigate<T extends ChannelTab>(tab: T): Promise<Result<ChannelContext[T], Error>>;
    getChannelData(): Result<ChannelData, Error>;
}
export interface AboutData {
    description: string;
    links: {
        title: string;
        url: string;
    }[];
}
declare class TabData<TTab extends ChannelTab = any> {
    private readonly tabs;
    private readonly active;
    static from(rawTabs: TwoColumnBrowseResultsRenderer["tabs"]): Result<TabData, Error>;
    protected constructor(tabs: Record<ChannelTab, Tab>, active: TTab);
    getActive(): Tab<true>;
}
export {};
