"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelTabContext = exports.ChannelTab = exports.getChannelTabRegex = exports.CHANNEL_BASE_REGEX = void 0;
const neverthrow_1 = require("neverthrow");
const ErrorCodes_1 = require("../../../shared/errors/ErrorCodes");
const YouTubejsError_1 = require("../../../shared/errors/YouTubejsError");
const channel_data_1 = require("../../extractors/channel-data");
const ScrapingContext_1 = require("../ScrapingContext");
const about_data_1 = require("../../extractors/about-data");
/**
 * matches
 * - `youtube.com/@handle`,
 * - `youtube.com/channel/id`,
 * - `youtube.com/c/vanityURL`
 */
exports.CHANNEL_BASE_REGEX = /youtube\.com\/(@[A-Za-z0-9_\-]+|c\/[A-Za-z0-9_\-]+|channel\/[A-Za-z0-9_\-]+)/;
function getChannelTabRegex(tab) {
    const string = String(exports.CHANNEL_BASE_REGEX).replace(/^(\/)+|(\/)+$/, "") + `${tab}`;
    return new RegExp(string);
}
exports.getChannelTabRegex = getChannelTabRegex;
var ChannelTab;
(function (ChannelTab) {
    ChannelTab["Featured"] = "featured";
    ChannelTab["Videos"] = "videos";
    ChannelTab["Shorts"] = "shorts";
    /**
     * aka "Live"
     */
    ChannelTab["Streams"] = "streams";
    ChannelTab["Releases"] = "releases";
    ChannelTab["Playlists"] = "playlists";
    ChannelTab["Podcasts"] = "podcasts";
    ChannelTab["Community"] = "community";
    ChannelTab["Store"] = "store";
    ChannelTab["Search"] = "search";
})(ChannelTab = exports.ChannelTab || (exports.ChannelTab = {}));
const IS_CHANNEL_TAB_LOOKUP = new Set(Object.values(ChannelTab));
/**
 * Base class for all channel tabs.
 */
class ChannelTabContext extends ScrapingContext_1.ScrapingContext {
    _tabData;
    get tabData() {
        return this.getTabData();
    }
    getTabData() {
        if (this._tabData)
            return (0, neverthrow_1.ok)(this._tabData);
        try {
            const { tabs } = this.data.ytInitialData.contents
                .twoColumnBrowseResultsRenderer;
            const tabData = TabData.from(tabs);
            if (tabData.isErr())
                return (0, neverthrow_1.err)(tabData.error);
            this._tabData = tabData.value;
            return (0, neverthrow_1.ok)(this._tabData);
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
    getData() {
        return this.tabData.map(data => data.getActive().content);
    }
    async fetchAbout() {
        if (!this.data.ytInitialData)
            return (0, neverthrow_1.err)(new Error(`Something went wrong!`));
        const links = this.data.ytInitialData.header?.c4TabbedHeaderRenderer?.headerLinks;
        if (!links)
            return (0, neverthrow_1.err)(new Error(`No header links present!`));
        const model = links.channelHeaderLinksViewModel;
        if (!model)
            return (0, neverthrow_1.err)(new Error(`No header present!`));
        if (!model.more)
            return (0, neverthrow_1.err)(new Error(`No about continuation renderer present!`));
        const moreEndpoint = model.more.commandRuns[0].onTap.innertubeCommand
            .showEngagementPanelEndpoint;
        if (!moreEndpoint)
            return (0, neverthrow_1.err)(new Error(`No about continuation renderer present!`));
        const continuationRenderer = moreEndpoint.engagementPanel.engagementPanelSectionListRenderer
            .content.sectionListRenderer.contents[0].itemSectionRenderer
            .contents[0].continuationItemRenderer;
        if (!continuationRenderer)
            return (0, neverthrow_1.err)(new Error(`No about continuation renderer present!`));
        const data = await this.browse({
            clickTrackingParams: continuationRenderer.clickTrackingParams,
            visitorData: this.getVisitorData(),
            token: continuationRenderer.continuationEndpoint.continuationCommand
                .token,
        });
        if (data.isErr())
            return (0, neverthrow_1.err)(data.error);
        const { onResponseReceivedEndpoints: [{ appendContinuationItemsAction: { continuationItems }, },], } = data.value;
        const channelData = continuationItems[0].aboutChannelRenderer.metadata;
        try {
            return (0, neverthrow_1.ok)((0, about_data_1.extractAboutData)(channelData));
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
    /**
     * Navigates to the given tab, if it exists.
     */
    async navigate(tab) {
        const tabData = this.data.ytInitialData.contents.twoColumnBrowseResultsRenderer?.tabs.find(t => t.tabRenderer?.endpoint?.commandMetadata?.webCommandMetadata?.url
            .split("/")
            .filter(p => !!p)
            .pop() === tab);
        if (!tabData)
            return (0, neverthrow_1.err)(new Error(`Could not find tab ${tab}.`));
        const endpoint = (tabData.tabRenderer ?? tabData.expandableTabRenderer)
            ?.endpoint;
        if (!endpoint)
            return (0, neverthrow_1.err)(new Error(`Could not find endpoint for ${tab}.`));
        const newData = await this.browse({
            clickTrackingParams: endpoint.clickTrackingParams,
            visitorData: this.getVisitorData(),
            browseId: endpoint.browseEndpoint.browseId,
            params: endpoint.browseEndpoint.params,
        });
        if (newData.isErr()) {
            return (0, neverthrow_1.err)(newData.error);
        }
        const url = `https://www.youtube.com${endpoint.browseEndpoint.canonicalBaseUrl}/${tab}`;
        const context = this.contextFactory.fromBodyData(url, {
            ytInitialData: { ...this.data.ytInitialData, ...newData.value },
        });
        if (context.isErr())
            return (0, neverthrow_1.err)(context.error);
        context.value._visitorData = this.getVisitorData();
        return context;
    }
    getChannelData() {
        try {
            return (0, neverthrow_1.ok)((0, channel_data_1.extractChannelData)(this.data.ytInitialData.microformat
                .microformatDataRenderer));
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
}
exports.ChannelTabContext = ChannelTabContext;
function getTabName(path) {
    const [, channel, tab] = path.trim().split("/");
    if (!tab)
        return (0, neverthrow_1.err)(new Error(`Could not extract tab name from ${path}.`));
    if (!IS_CHANNEL_TAB_LOOKUP.has(tab))
        return (0, neverthrow_1.err)(new YouTubejsError_1.YoutubejsError(ErrorCodes_1.YtjsErrorCode.UnknownChannelTab, channel, tab));
    return (0, neverthrow_1.ok)(tab);
}
class TabData {
    tabs;
    active;
    static from(rawTabs) {
        try {
            let active;
            const tabs = {};
            for (const tab of rawTabs) {
                const renderer = tab.tabRenderer ?? tab.expandableTabRenderer;
                if (!renderer)
                    return (0, neverthrow_1.err)(new Error("No renderer in tab."));
                const endpoint = renderer.endpoint;
                if (!endpoint)
                    return (0, neverthrow_1.err)(new Error("Could not extract endpoint for tab."));
                const tabName = getTabName(endpoint.commandMetadata.webCommandMetadata.url);
                if (tabName.isErr())
                    return (0, neverthrow_1.err)(tabName.error);
                if (!tabName.value)
                    continue;
                const selected = renderer.selected ?? false;
                if (selected)
                    active = tabName.value;
                tabs[tabName.value] = {
                    endpoint,
                    selected,
                    content: (selected
                        ? renderer.content
                        : undefined),
                };
            }
            if (!active)
                return (0, neverthrow_1.err)(new Error("Failed determining active tab."));
            return (0, neverthrow_1.ok)(new TabData(tabs, active));
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
    constructor(tabs, active) {
        this.tabs = tabs;
        this.active = active;
    }
    getActive() {
        return this.tabs[this.active];
    }
}
