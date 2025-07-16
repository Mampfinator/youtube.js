import { err, Err, ok, Result } from "neverthrow";
import { CommunityPostContext, ContextFactory } from "./context";
import { CommunityPost } from "./types/external/community-posts";
import { ChannelData } from "./types";
import { CommentFetcher } from "./CommentFetcher";

export class PostScraper {
    private post?: CommunityPost;
    private channelData?: ChannelData;
    private context?: CommunityPostContext;

    constructor(
        private readonly factory: ContextFactory,
        private readonly id: string, 
        private readonly options?: {
            query?: {
                /**
                 * Linked comment ID, if any.
                 */
                lc?: string
            }
        }
    ) {}

    private async ensureContext(
        forceRefetch?: boolean,
    ): Promise<Result<CommunityPostContext, Error>> {
        if (!forceRefetch && this.context !== undefined)
            return ok(this.context);

        let url = `https://youtube.com/post/${this.id}`;
        if (this.options?.query) {
            const query = new URLSearchParams(this.options.query);
            url += `?${query.toString()}`;
        }

        const context = await this.factory.fromUrl(
            url,
            CommunityPostContext,
        );

        if (context.isOk()) this.context = context.value;
        return context;
    }

    /**
     * @param forceRefetch if true, will fetch data from YouTube even if there's a post cached.
     */
    public async getPost(
        forceRefetch?: boolean,
    ): Promise<Result<CommunityPost, Error>> {
        if (!forceRefetch && this.post !== undefined) return ok(this.post);

        const context = await this.ensureContext(forceRefetch);
        if (context.isErr()) return context as Err<never, Error>;

        const post = context.value.getPost();
        if (post.isOk()) this.post = post.value;

        return post;
    }

    /**
     * @param forceRefetch if true, will fetch data from YouTube even if there's channel data cached.
     */
    public async getChannelData(
        forceRefetch?: boolean,
    ): Promise<Result<ChannelData, Error>> {
        if (!forceRefetch && this.channelData !== undefined)
            return ok(this.channelData);

        const context = await this.ensureContext(forceRefetch);
        if (context.isErr()) return context as Err<never, Error>;

        const channel = context.value.getChannelData();
        if (channel.isOk()) this.channelData = channel.value;

        return channel;
    }

    public async fetchComments(): Promise<Result<CommentFetcher, Error>> {
        const context = await this.ensureContext();
        if (context.isErr()) return context as Result<never, Error>;
        try {
            const comments = context.value.comments();

            return ok(comments);
        } catch (error) {
            return err(error as Error);
        }
    }
}
