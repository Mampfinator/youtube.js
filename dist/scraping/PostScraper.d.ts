import { Result } from "neverthrow";
import { ContextFactory } from "./context";
import { CommunityPost } from "./types/external/community-posts";
import { ChannelData } from "./types";
import { CommentFetcher } from "./CommentFetcher";
export declare class PostScraper {
    private readonly factory;
    private readonly id;
    private readonly options?;
    private post?;
    private channelData?;
    private context?;
    constructor(factory: ContextFactory, id: string, options?: {
        query?: {
            /**
             * Linked comment ID, if any.
             */
            lc?: string | undefined;
        } | undefined;
    } | undefined);
    private ensureContext;
    /**
     * @param forceRefetch if true, will fetch data from YouTube even if there's a post cached.
     */
    getPost(forceRefetch?: boolean): Promise<Result<CommunityPost, Error>>;
    /**
     * @param forceRefetch if true, will fetch data from YouTube even if there's channel data cached.
     */
    getChannelData(forceRefetch?: boolean): Promise<Result<ChannelData, Error>>;
    fetchComments(): Promise<Result<CommentFetcher, Error>>;
}
