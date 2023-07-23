import { ItemIdentifier, Override, Replace } from "../../base-types";
import { ContentDetails, LiveStreamingDetails, Snippet, Status, VideoResource } from "./api-types";
type VideoIdentifier = ItemIdentifier<"youtube#video">;
export type VideoPart = Exclude<keyof FullVideoType, keyof VideoIdentifier>;
export type Video<TPart extends VideoPart> = Pick<FullVideoType, TPart> & VideoIdentifier;
type FullVideoType = Override<VideoResource, {
    snippet: Replace<Snippet, "publishedAt", Date>;
    status: Replace<Status, "publishAt", Date>;
    liveStreamingDetails: Replace<LiveStreamingDetails, "scheduledStartTime" | "actualStartTime" | "actualEndTime" | "scheduledEndTime", Date | undefined>;
    contentDetails: Replace<ContentDetails, "caption", boolean>;
}>;
export {};
