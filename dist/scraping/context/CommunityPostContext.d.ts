import { Result } from "neverthrow";
import { CommunityPost, ChannelData } from "../types";
import { ScrapingContext } from "./ScrapingContext";
/**
 * Context for individual community posts.
 */
export declare class CommunityPostContext extends ScrapingContext {
    getPost(): Result<CommunityPost, Error>;
    getChannelData(): Result<ChannelData, Error>;
}
