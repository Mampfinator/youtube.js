import { ItemIdentifier } from "../../base-types";
import { ContentDetails, LiveStreamingDetails, Snippet, Status, VideoResource } from "./api-types";

export type VideoPart = Exclude<keyof (VideoResource | ParsedVideoResourceOverrides), "kind" | "etag" | "id">;
export type Video<TPart extends VideoPart> = ItemIdentifier<"youtube#video"> & {
    [P in TPart]: ParsedVideoResourceOverrides[P] extends undefined | never ? VideoResource[P] : ParsedVideoResourceOverrides[P];
};


interface ParsedVideoResourceOverrides {
    snippet: ParsedSnippet;
    status: ParsedStatus;
    liveStreamingDetails: ParsedLiveStreamingDetails;
    contentDetails: ParsedContentDetails; 
}


type Replace<TSource extends object, TReplace extends keyof TSource, TNew> = {
    [P in keyof TSource]: P extends TReplace ? TNew : TSource[P]; 
}
type ParsedSnippet = Replace<Snippet, "publishedAt", Date>;
type ParsedStatus = Replace<Status, "publishAt", Date>;
//type ParsedRecordingDetails = Omit<RecordingDetails, "recordingDate"> & { recordingDate: Date };
type ParsedLiveStreamingDetails = Replace<LiveStreamingDetails, "scheduledStartTime" | "actualStartTime" | "actualEndTime" | "scheduledEndTime", Date | undefined>;
type ParsedContentDetails = Replace<ContentDetails, "caption", boolean>;