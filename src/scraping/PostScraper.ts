import { err, ok, Result } from "neverthrow";
import { CommunityPostContext, ContextFactory } from "./context";
import { CommunityPost } from "./types/external/community-posts";

export class PostScraper {
    private post?: CommunityPost;
    private context?: CommunityPostContext;

    constructor(
        private readonly factory: ContextFactory,
        private readonly id: string,
    ) {}

    public async fetch(): Promise<Result<CommunityPost, Error>> {
        if (this.post) return ok(this.post);

        const context = await this.factory.fromUrl(`https://youtube.com/post/${this.id}`, CommunityPostContext);
        if (context.isErr()) return err(context.error as Error);

        const post = context.value.getPost();
        if (post.isOk()) this.post = post.value;

        return post;
    }
}