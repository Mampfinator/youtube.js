import { Result } from "neverthrow";
import { RequireOnlyOne } from "../base-types";
import { YouTubeClient } from "../client";
import { YouTubeEndpoints } from "../endpoints";
import { YouTubeAPIError, YouTubeClientError } from "../errors";
import { Video, VideoPart } from "./types/parsed-types";
type ListOptions<TPart extends VideoPart> = RequireOnlyOne<{
    part: Partial<Record<TPart, true>>;
    ids: string[];
    mostPopular: boolean;
    myRating: "dislike" | "like";
    hl?: string;
    maxHeight?: number;
    maxWidth?: number;
    maxResults?: number;
}, "ids" | "mostPopular" | "myRating">;
export declare class VideosEndpoints extends YouTubeEndpoints {
    constructor(client: YouTubeClient);
    list<TPart extends VideoPart>(options: ListOptions<TPart>): Promise<Result<Video<TPart>[], YouTubeAPIError | YouTubeClientError>>;
}
export {};
