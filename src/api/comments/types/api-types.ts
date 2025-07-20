import { ItemIdentifier } from "../../base-types";

export type CommentPart = "id" | "snippet";

export type CommentId = string;
export type CommentSnippet = {
    authorDisplayName: string;
    authorProfileImageUrl: string;
    authorChannelUrl: string;
    authorChannelId: {
        value: string;
    };
    channelId: string;
    textDisplay: string;
    textOriginal: string;
    parentId: string;
    canRate: boolean;
    viewerRating: string;
    likeCount: number;
    moderationStatus: string;
    publishedAt: string;
    updatedAt: string;
};

export type CommentResource = ItemIdentifier<"youtube#comment"> & {
    snippet: CommentSnippet,
    id: CommentId,
};