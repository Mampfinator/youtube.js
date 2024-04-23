import { ChannelTab } from "../../context";
import { FeaturedTabScraper } from "./Featured";

export type ChannelTabScraper = {
    [ChannelTab.Featured]: FeaturedTabScraper;
};
