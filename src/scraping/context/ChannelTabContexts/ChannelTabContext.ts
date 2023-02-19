import { YtInitialData } from "../../types";
import { ScrapingContext } from "../ScrapingContext";
/**
 * matches `youtube.com/@handle`, `youtube.com/channel/id`, `youtube.com/c/vanity_URL`
 */
export const CHANNEL_BASE_REGEX = /youtube\.com\/(@[A-z0-9\-]+|c\/[A-z0-9\-]+|channel\/[A-z0-9\-]+)/;

export function getChannelTabRegex(tab: string): RegExp {
    const string = String(CHANNEL_BASE_REGEX).replace(/^(\/)+|(\/)+$/, "") + `${tab}`;
    return new RegExp(string);
}

/**
 * Base class for all channel tabs.
 */
export abstract class ChannelTabContext<
    TExtractData extends object = {ytInitialData: YtInitialData}
> extends ScrapingContext<TExtractData> {

}