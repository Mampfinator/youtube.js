import { Err, ok, Result } from "neverthrow";
import { CommunityPostContext, ContextFactory } from "./context";
import { CommunityPost } from "./types/external/community-posts";
import { ChannelData } from "./types";

export class PostScraper {
    private post?: CommunityPost;
    private channelData?: ChannelData;
    private context?: CommunityPostContext;

    constructor(
        private readonly factory: ContextFactory,
        private readonly id: string,
    ) {}

    private async ensureContext(
        forceRefetch?: boolean,
    ): Promise<Result<CommunityPostContext, Error>> {
        if (!forceRefetch && this.context !== undefined)
            return ok(this.context);

        const context = await this.factory.fromUrl(
            `https://youtube.com/post/${this.id}`,
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
}
