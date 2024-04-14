"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelScraper = void 0;
const neverthrow_1 = require("neverthrow");
const URLBuilder_1 = require("../shared/builders/URLBuilder");
const context_1 = require("./context");
const ChannelTabContext_1 = require("./context/ChannelTabContexts/ChannelTabContext");
const FetchError_1 = require("./errors/FetchError");
const scraping_constants_1 = require("./scraping.constants");
/**
 * Represents a channel as seen on the YouTube website.
 */
// TODO cache contexts and switch internally.
class ChannelScraper {
    factory;
    builder;
    lastContext;
    constructor(factory, options) {
        this.factory = factory;
        const entries = Object.entries(options);
        if (entries.length > 1)
            throw new TypeError(`Expected only one option, got ${entries.length}: ${Object.keys(options).join(", ")}`);
        const [[key, value]] = entries;
        this.builder = URLBuilder_1.URLBuilder.channel()[key](value);
    }
    async fetchElements(tab, useContext, limit) {
        const context = await this.factory.fromUrl(this.builder.tab(tab).build(), useContext);
        if (context.isErr())
            return (0, neverthrow_1.err)(context.error);
        this.lastContext = context.value;
        const fetchResult = await context.value.fetchElements(limit);
        if (fetchResult.isErr())
            return (0, neverthrow_1.err)(new FetchError_1.FetchError(FetchError_1.FetchErrorCode.InternalError, {}, fetchResult.error));
        return (0, neverthrow_1.ok)([...context.value.get().values()]);
    }
    /**
     * @returns all posts from this channel.
     */
    async fetchAllPosts() {
        return this.fetchElements(ChannelTabContext_1.ChannelTab.Community, context_1.CommunityContext);
    }
    /**
     * @param recentOverride how many posts to fetch. Defaults to 15.
     * @returns the most recent posts on this channel, up to `recentOverrie`.
     */
    async fetchRecentPosts(recentOverride) {
        return this.fetchElements(ChannelTabContext_1.ChannelTab.Community, context_1.CommunityContext, recentOverride ?? scraping_constants_1.RECENT_LIMIT);
    }
    /**
     * @returns all shorts from this channel.
     */
    async fetchAllShorts() {
        return this.fetchElements(ChannelTabContext_1.ChannelTab.Shorts, context_1.ShortsContext);
    }
    /**
     * @param recentOverride how many shorts to fetch. Defaults to 15.
     * @returns the most recent shorts on this channel, up to `recentOverrie`.
     */
    async fetchRecentShorts(recentOverride) {
        return this.fetchElements(ChannelTabContext_1.ChannelTab.Shorts, context_1.ShortsContext, recentOverride ?? scraping_constants_1.RECENT_LIMIT);
    }
    /**
     * @returns all streams from this channel.
     */
    async fetchAllStreams() {
        return this.fetchElements(ChannelTabContext_1.ChannelTab.Streams, context_1.StreamsContext);
    }
    /**
     * @param recentOverride how many streams to fetch. Defaults to 15.
     * @returns the most recent streams on this channel, up to `recentOverrie`.
     */
    async fetchRecentStreams(recentOverride) {
        return this.fetchElements(ChannelTabContext_1.ChannelTab.Streams, context_1.StreamsContext, recentOverride ?? scraping_constants_1.RECENT_LIMIT);
    }
    /**
     * @returns all uploads from this channel.
     */
    async fetchAllVideos() {
        return this.fetchElements(ChannelTabContext_1.ChannelTab.Videos, context_1.VideosContext);
    }
    /**
     * @param recentOverride how many videos to fetch. Defaults to 15.
     * @returns the most recent videos on this channel, up to `recentOverrie`.
     */
    async fetchRecentVideos(recentOverride) {
        return this.fetchElements(ChannelTabContext_1.ChannelTab.Videos, context_1.VideosContext, recentOverride ?? scraping_constants_1.RECENT_LIMIT);
    }
    /**
     * Extracts the channel's metadata. Requires any `fetch` method to have been called previously.
     */
    getChannelData() {
        if (!this.lastContext)
            return (0, neverthrow_1.err)(new Error(`To extract channel data, make any other request first!`));
        return this.lastContext.getChannelData();
    }
    /**
     * Fetches **all** watchable content (from `/videos`, `/shorts` and `/streams`).
     * @returns the fetched videos. If a property is undefined, its fetching errors appear in `errors`.
     */
    async fetchAll() {
        const shorts = await this.fetchAllShorts();
        const streams = await this.fetchAllStreams();
        const videos = await this.fetchAllVideos();
        const ret = {
            errors: [],
        };
        if (shorts.isOk())
            ret.shorts = shorts.value;
        else
            ret.errors.push(...(Array.isArray(shorts.error)
                ? shorts.error
                : [shorts.error]));
        if (streams.isOk())
            ret.streams = streams.value;
        else
            ret.errors.push(...(Array.isArray(streams.error)
                ? streams.error
                : [streams.error]));
        if (videos.isOk())
            ret.videos = videos.value;
        else
            ret.errors.push(...(Array.isArray(videos.error)
                ? videos.error
                : [videos.error]));
        return ret;
    }
    async fetchAbout() {
        if (!this.lastContext)
            return (0, neverthrow_1.err)(new Error(`To fetch a channel about, make any other request first!`));
        return this.lastContext.fetchAbout();
    }
    /**
     * @returns a list of channels this channel features.
     */
    async fetchFeaturedChannels() {
        const context = await this.factory.fromUrl(this.builder.build(), context_1.FeaturedContext);
        if (context.isErr())
            return (0, neverthrow_1.err)(context.error);
        this.lastContext = context.value;
        return context.value.getFeaturedChannels();
    }
}
exports.ChannelScraper = ChannelScraper;
