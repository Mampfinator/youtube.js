import { Result } from "neverthrow";
import { ContextFactory } from "./context";
import { CommunityPost } from "./types/external/community-posts";
import { ChannelData } from "./types";
export declare class PostScraper {
    private readonly factory;
    private readonly id;
    private post?;
    private channelData?;
    private context?;
    constructor(factory: ContextFactory, id: string);
    private ensureContext;
    /**
     * @param forceRefetch if true, will fetch data from YouTube even if there's a post cached.
     */
    getPost(forceRefetch?: boolean): Promise<Result<CommunityPost, Error>>;
    /**
     * @param forceRefetch if true, will fetch data from YouTube even if there's channel data cached.
     */
    getChannelData(forceRefetch?: boolean): Promise<Result<ChannelData, Error>>;
}
