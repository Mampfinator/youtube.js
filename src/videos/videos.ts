import { err, Err, ok, Result } from "neverthrow";
import { ITransform, ListResponse, RequireOnlyOne } from "../base-types";
import { YouTubeClient } from "../client";
import { YouTubeEndpoints } from "../endpoints";
import { YouTubeAPIError, YouTubeClientError } from "../errors";
import { Video, VideoPart } from "./types/parsed-types";
import { VideoResource } from "./types/api-types";
import { mapProperties, toDate, toDateOpt } from "../util/util";


type ListOptions<TPart extends VideoPart> = RequireOnlyOne<{
    part: Partial<Record<TPart, true>>;
    
    // filters
    ids: string[];
    mostPopular: boolean;
    myRating: "dislike" | "like";

    
    hl?: string;
    maxHeight?: number;
    maxWidth?: number;

    maxResults?: number;
}, "ids" | "mostPopular" | "myRating">;



type VideoListResponse = ListResponse<"youtube#videoListResponse", VideoResource>

export class VideosEndpoints extends YouTubeEndpoints {
    constructor(client: YouTubeClient) {
        super(client, "videos", [
            { for: "youtube#video", transform(source: VideoResource): Video<VideoPart> {
                const entries: [keyof Video<VideoPart>, any][] = [
                    ["kind", source.kind],
                    ["etag", source.etag],
                    ["id", source.id],
                ]

                if (source.snippet) {
                    entries.push(["snippet", mapProperties(source.snippet, {publishedAt: toDate})])
                }

                if (source.liveStreamingDetails) {
                    entries.push(["liveStreamingDetails", mapProperties(source.liveStreamingDetails, {scheduledEndTime: toDateOpt, actualEndTime: toDateOpt, scheduledStartTime: toDateOpt, actualStartTime: toDateOpt})])
                }

                if (source.status) {
                    entries.push(["status", mapProperties(source.status, {publishAt: toDateOpt})]);
                }

                if (source.contentDetails) {
                    entries.push(["contentDetails", mapProperties(source.contentDetails, {caption: Boolean})]);
                }

                return Object.fromEntries(entries) as any;
            }}
        ]);
    }

    public async list<TPart extends VideoPart>(options: ListOptions<TPart>): Promise<Result<Video<TPart>[], YouTubeAPIError | YouTubeClientError>> {
        const {part, ids, mostPopular, myRating} = options;

        const result = await this.client.get<VideoListResponse>("videos", {
            query: {
                part: Object.keys(part),
                id: ids?.join(","),
                chart: mostPopular ? "mostPopular" : undefined,
                myRating,
            }
        });

        if (result.isErr()) return err(result.error);

        const transformed = result.value.items.map(item => this.transform<VideoResource, Video<VideoPart>>(item));

        if (transformed.filter(v => v).length !== transformed.length) return err(new YouTubeClientError());

        return ok(
            transformed as Video<TPart>[]
        );
    }
}