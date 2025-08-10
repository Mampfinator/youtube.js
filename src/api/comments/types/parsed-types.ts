import { Replace } from "../../base-types";
import { CommentPart, CommentId, CommentResource, CommentSnippet } from "./api-types";

type MapParts<TParts extends string, PartsMap extends Record<TParts, any>> = {
    [P in TParts]: PartsMap[P]
}

export type Comment<TParts extends CommentPart> = CommentResource & MapParts<TParts, {
    id: CommentId,
    snippet: Replace<CommentSnippet, "publishedAt" | "updatedAt", Date>,
}>;