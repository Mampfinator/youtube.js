import { CommentFetcher } from "./CommentFetcher";
import { ContextFactory } from "./context";
import { Result } from "neverthrow";
/**
 *
 */
export declare class ShortScraper {
    private readonly factory;
    private readonly id;
    private readonly options?;
    constructor(factory: ContextFactory, id: string, options?: {
        query?: {
            /**
             * Linked comment ID, if any.
             */
            lc?: string | undefined;
        } | undefined;
    } | undefined);
    private context?;
    private ensureContext;
    fetchComments(): Promise<Result<CommentFetcher, Error>>;
}
