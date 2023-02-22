import { ElementContext } from "./ElementContext";

type Comment = {};

/**
 * Base class for all comment-related contexts.
 */
export abstract class CommentContext extends ElementContext<Comment> {}
