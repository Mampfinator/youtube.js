import { CommentFetcher } from "./CommentFetcher";
import { ContextFactory, ShortContext } from "./context";
import { Result, err, ok } from "neverthrow";

/**
 * 
 */
export class ShortScraper {
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

    private context?: ShortContext;

    private async ensureContext(
        forceRefetch?: boolean,
    ): Promise<Result<ShortContext, Error>> {
        if (!forceRefetch && this.context !== undefined)
            return ok(this.context);

        let url = `https://youtube.com/shorts/${this.id}`;
        if (this.options?.query) {
            const query = new URLSearchParams(this.options.query);
            url += `?${query.toString()}`;
        }

        const context = await this.factory.fromUrl(
            url,
            ShortContext,
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