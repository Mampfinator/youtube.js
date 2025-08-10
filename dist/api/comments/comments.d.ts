import { Result } from "neverthrow";
import { RequireOnlyOne } from "../base-types";
import { YouTubeClient } from "../client";
import { YouTubeEndpoints } from "../endpoints";
import { CommentPart } from "./types/api-types";
import { YouTubeAPIError, YouTubeClientError } from "../errors";
import { Comment } from "./types/parsed-types";
export type CommentListOptions<TPart extends CommentPart> = RequireOnlyOne<{
    part: TPart[];
    id: string;
    parentId: string;
    maxResults?: number;
    pageToken?: string;
    textFormat?: "html" | "plainText";
}, "id" | "parentId">;
export declare class CommentEndpoints extends YouTubeEndpoints {
    constructor(client: YouTubeClient);
    list<TPart extends CommentPart>(options: CommentListOptions<TPart>): Promise<Result<Comment<TPart>[], YouTubeAPIError | YouTubeClientError>>;
}
