"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabScraper = void 0;
/**
 * Base class for all tab scrapers.
 */
class TabScraper {
    ytInitialData;
    constructor(ytInitialData) {
        this.ytInitialData = ytInitialData;
    }
    async navigate(tab) {
        const endpoints = this.ytInitialData.contents
            .twoColumnBrowseResultsRenderer.tabs.map(tab => tab.tabRenderer?.endpoint)
            .filter(c => !!c);
        const endpoint = endpoints.find(e => e?.commandMetadata.webCommandMetadata.url);
    }
}
exports.TabScraper = TabScraper;
