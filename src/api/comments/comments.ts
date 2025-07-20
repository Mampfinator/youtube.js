import { err, ok, Result } from "neverthrow";
import { ListResponse, RequireOnlyOne } from "../base-types";
import { YouTubeClient } from "../client";
import { YouTubeEndpoints } from "../endpoints";
import { CommentPart, CommentResource } from "./types/api-types";
import { YouTubeAPIError, YouTubeClientError } from "../errors";
import { Comment } from "./types/parsed-types";
import { mapProperties, toDate } from "../util";

export type CommentListOptions<TPart extends CommentPart> = RequireOnlyOne<{
    part: TPart[],
    id: string,
    parentId: string,
    maxResults?: number,
    pageToken?: string,
    textFormat?: "html" | "plainText"
}, "id" | "parentId">;

export class CommentEndpoints extends YouTubeEndpoints {
    constructor(client: YouTubeClient) {
        super(client, "comments", [
            {
                for: "youtube#comment",
                transform(source: CommentResource): Comment<CommentPart> {
                    const replacers = {
                        snippet: (raw: unknown) => mapProperties(source.snippet, {
                            publishedAt: toDate,
                            updatedAt: toDate,
                        })
                    };

                    return Object.fromEntries(
                        Object.entries(source)
                            .map(([key, value]) => [
                                key, replacers[key as keyof typeof replacers]?.(value) ?? value,
                            ])
                    ) as any as Comment<CommentPart>
                }
            }
        ])
    }

    public async list<TPart extends CommentPart>(
        options: CommentListOptions<TPart>,
    ): Promise<Result<Comment<TPart>[], YouTubeAPIError | YouTubeClientError>> {
        const result = await this.client.get<ListResponse<"youtube#commentListResponse", CommentResource>>(
            "comments",
            {
                query: {
                    ...options,
                }
            }
        );

        if (result.isErr()) return err(result.error);

        const transformed = result.value.items.map(item => this.transform(item));

        return ok(transformed as Comment<TPart>[]);
    }
}