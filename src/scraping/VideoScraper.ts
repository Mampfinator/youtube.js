import { CommentFetcher } from "./CommentFetcher";
import { ContextFactory, VideoPlayerContext } from "./context";
import { Result, err, ok } from "neverthrow";

/**
 * 
 */
export class VideoScraper {
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
    ) { }

    private context?: VideoPlayerContext;

    private async ensureContext(
        forceRefetch?: boolean,
    ): Promise<Result<VideoPlayerContext, Error>> {
        if (!forceRefetch && this.context !== undefined)
            return ok(this.context);

        const query = { ...(this.options?.query ?? {}), ...{ id: this.id} };


        const url = `https://youtube.com/watch?${new URLSearchParams(query).toString()}`;

        const context = await this.factory.fromUrl(
            url,
            VideoPlayerContext,
        );

        if (context.isOk()) this.context = context.value;

        return context;
    }

    public async fetchComments(): Promise<Result<CommentFetcher, Error>> {
        const context = await this.ensureContext();
        if (context.isErr()) return context as Result<never, Error>;
        try {
            return ok(context.value.comments());
        } catch (error) {
            return err(error as Error);
        }
    }
}