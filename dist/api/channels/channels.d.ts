import { Result } from "neverthrow";
import { RequireOnlyOne } from "../base-types";
import { YouTubeClient } from "../client";
import { YouTubeEndpoints } from "../endpoints";
import { YouTubeAPIError, YouTubeClientError } from "../errors";
import { Channel, ChannelPart } from "./types/parsed-types";
type ListOptions<TPart extends ChannelPart> = RequireOnlyOne<{
    part: Partial<Record<TPart, true>>;
    hl?: string;
    maxResults?: number;
    pageToken?: string;
    categoryId: string;
    forUsername: string;
    ids: string[];
    managedByMe: boolean;
    mine: boolean;
}, "categoryId" | "forUsername" | "ids" | "managedByMe" | "mine">;
export declare class ChannelsEndpoints extends YouTubeEndpoints {
    constructor(client: YouTubeClient);
    list<TPart extends ChannelPart>(options: ListOptions<TPart>): Promise<Result<Channel<TPart>[], YouTubeAPIError | YouTubeClientError>>;
}
export {};
