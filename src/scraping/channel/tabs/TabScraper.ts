import { ChannelTabScraper } from ".";
import { ChannelTab } from "../../context";
import { YtInitialData } from "../../types";

/**
 * Base class for all tab scrapers.
 */
export abstract class TabScraper {
    constructor(protected readonly ytInitialData: YtInitialData) {}

    public async navigate<T extends ChannelTab>(tab: T): Promise<void> {
        const endpoints = this.ytInitialData.contents
            .twoColumnBrowseResultsRenderer!.tabs.map(
                tab => tab.tabRenderer?.endpoint,
            )
            .filter(c => !!c);

        const endpoint = endpoints.find(
            e => e?.commandMetadata.webCommandMetadata.url,
        );
    }
}
