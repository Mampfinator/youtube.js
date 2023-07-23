export declare enum VideoType {
    Video = "Video",
    Short = "Short",
    Stream = "Stream"
}
export declare enum StreamStatus {
    Offline = "Offline",
    Live = "Live",
    Upcoming = "Upcoming"
}
export interface BaseVideo {
    id: string;
    title: string;
    thumbnail: string;
}
export interface ScrapedVideo extends BaseVideo {
    type: VideoType.Video;
}
export interface ScrapedStream extends BaseVideo {
    type: VideoType.Stream;
    status: StreamStatus;
}
export interface ScrapedShort extends BaseVideo {
    type: VideoType.Short;
}
/**
 * Represents a video from a channel overview. Can be narrowed by checking its {@linkcode VideoType type}.
 */
export type Video = ScrapedVideo | ScrapedStream | ScrapedShort;
