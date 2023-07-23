import { ItemIdentifier, Thumbnail } from "../../base-types";
/**
 * https://developers.google.com/youtube/v3/docs/videos#resource
 */
export interface VideoResource extends ItemIdentifier<"youtube#video"> {
    snippet: Snippet;
    contentDetails: ContentDetails;
    status: Status;
    statistics: Statistics;
    player: Player;
    liveStreamingDetails: LiveStreamingDetails;
}
export interface ContentDetails {
    /**
     * The length of the video. The property value is an [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations).
     */
    duration: string;
    dimension: "2D" | "3D";
    definition: "hd" | "sd";
    caption: "true" | "false";
    licensedContent: boolean;
    regionRestriction: {
        allowed: string[];
        blocked: string[];
    };
    contentRating: Record<string, string | string[]>;
    projection: "360" | "rectangular";
    hasCustomThumbnail: boolean;
}
export interface LiveStreamingDetails {
    actualStartTime: string;
    actualEndTime: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    concurrentViewers: number;
    activeLiveChatId: string;
}
export interface Player {
    embedHtml: string;
    embedHeight: number;
    embedWidth: number;
}
/**
 * The snippet object contains basic details about the video, such as its title, description, and category.
 */
export interface Snippet {
    /**
     * The date and time that the video was published. Note that this time might be different than the time that the video was uploaded. For example, if a video is uploaded as a private video and then made public at a later time, this property will specify the time that the video was made public.
     *
     * There are a couple of special cases:
     * - If a video is uploaded as a private video and the video metadata is retrieved by the channel owner, then the property value specifies the date and time that the video was uploaded.
     * - If a video is uploaded as an unlisted video, the property value also specifies the date and time that the video was uploaded. In this case, anyone who knows the video's unique video ID can retrieve the video metadata.
     *
     * The value is specified in ISO 8601 format.
     */
    publishedAt: string;
    /**
     * The ID that YouTube uses to uniquely identify the channel that the video was uploaded to.
     */
    channelId: string;
    /**
     * The video's title. The property value has a maximum length of 100 characters and may contain all valid UTF-8 characters except < and >.
     */
    title: string;
    /**
     * The video's description. The property value has a maximum length of 5000 bytes and may contain all valid UTF-8 characters except < and >.
     */
    description: string;
    thumbnails: {
        default: Thumbnail<120, 90>;
        medium: Thumbnail<320, 180>;
        high: Thumbnail<480, 360>;
        standard?: Thumbnail<640, 480>;
        maxres?: Thumbnail<1280, 720>;
    };
    /**
     * Channel title (name) for the channel that the video belongs to.
     */
    channelTitle: string;
    /**
     * A list of keyword tags associated with the video. Tags may contain spaces. The property value has a maximum length of 500 characters. Note the following rules regarding the way the character limit is calculated:
     *
     * The property value is a list, and commas between items in the list count toward the limit.
     * If a tag contains a space, the API server handles the tag value as though it were wrapped in quotation marks, and the quotation marks count toward the character limit. So, for the purposes of character limits, the tag Foo-Baz contains seven characters, but the tag Foo Baz contains nine characters.
     */
    tags: string[];
    /**
     * The YouTube video category associated with the video.
     */
    categoryId: string;
    /**
     * Indicates if the video is an upcoming/active live broadcast. Or it's "none" if the video is not an upcoming/active live broadcast.
     */
    liveBroadcastContent: LiveBroadcastContent;
    /**
     * The language of the text in the video resource's snippet.title and snippet.description properties.
     */
    defaultLanguage: string;
    /**
     * The snippet.localized object contains either a localized title and description for the video or the title in the default language for the video's metadata.
     *
     * Localized text is returned in the resource snippet if the videos.list request used the hl parameter to specify a language for which localized text should be returned and localized text is available in that language.
     * Metadata for the default language is returned if an hl parameter value is not specified or a value is specified but localized metadata is not available for the specified language.
     */
    localized: {
        title: string;
        description: string;
    };
    defaultAudioLanguage: string;
}
export declare enum LiveBroadcastContent {
    Live = "live",
    None = "none",
    Upcoming = "upcoming"
}
export interface Statistics {
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
    favoriteCount: 0;
    commentCount: number;
}
export type Status = MadeForKidsStatus | NotMadeForKidsStatus;
export interface BaseStatus {
    uploadStatus: UploadStatus;
    failureReason: FailureReason;
    rejectionReason: RejectionReason;
    privacyStatus: PrivacyStatus;
    /**
     * The date and time when the video is scheduled to publish. It can be set only if the privacy status of the video is private. The value is specified in ISO 8601 format.
     */
    publishAt?: string;
    license: VideoLicense;
    embeddable: boolean;
}
export interface MadeForKidsStatus extends BaseStatus {
    madeForKids: true;
    selfDeclaredMadeForKids: boolean;
}
export interface NotMadeForKidsStatus extends BaseStatus {
    madeForKids: false;
}
export declare enum UploadStatus {
    Deleted = "deleted",
    Failed = "failed",
    Processed = "processed",
    Rejected = "rejected",
    Uploaded = "uploaded"
}
export declare enum FailureReason {
    Codec = "codec",
    Conversion = "conversion",
    EmptyFile = "emptyFile",
    InvalidFile = "invalidFile",
    TooSmall = "tooSmall",
    UploadAborted = "uploadAborted"
}
export declare enum RejectionReason {
    Claim = "claim",
    Copyright = "copyright",
    Duplicate = "duplicate",
    Inappropriate = "inappropriate",
    Legal = "legal",
    Length = "length",
    TermsOfUse = "termsOfUse",
    Trademark = "trademark",
    UploaderAccountClosed = "uploaderAccountClosed",
    UploaderAccountSuspended = "uploaderAccountSuspended"
}
export declare enum PrivacyStatus {
    Private = "private",
    Public = "public",
    Unlisted = "unlisted"
}
export declare enum VideoLicense {
    CreativeCommon = "creativeCommon",
    YouTube = "youtube"
}
