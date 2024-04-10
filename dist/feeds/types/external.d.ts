export declare enum FeedType {
    Channel = "Channel",
    Playlist = "Playlist"
}
export interface BaseFeed {
    type: FeedType;
    channel: FeedChannel;
    title: string;
    published: Date;
    entries: FeedEntry[];
}
export interface FeedEntry {
    id: string;
    title: string;
    description: string;
    published: Date;
    updated: Date;
}
export interface FeedChannel {
    id: string;
    name: string;
}
export interface ChannelFeed extends BaseFeed {
    type: FeedType.Channel;
}
export interface PlaylistFeed extends BaseFeed {
    type: FeedType.Playlist;
    playlistId: string;
}
