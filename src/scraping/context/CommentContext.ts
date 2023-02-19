import { ElementContext } from "./ElementContext";
import { ScrapingContext } from "./ScrapingContext";

type Comment = {}

/**
 * Base class for all comment-related contexts.
 */
export abstract class CommentContext extends ElementContext<Comment> {}