import { ChannelTab } from "../../context";
import { YtInitialData } from "../../types";
/**
 * Base class for all tab scrapers.
 */
export declare abstract class TabScraper {
    protected readonly ytInitialData: YtInitialData;
    constructor(ytInitialData: YtInitialData);
    navigate<T extends ChannelTab>(tab: T): Promise<void>;
}
