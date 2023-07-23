import { ChannelFeed, PlaylistFeed } from "./types/external";
export declare class FeedClient {
    private readonly parser;
    constructor();
    private parse;
    forChannel(id: string): Promise<ChannelFeed>;
    forPlaylist(id: string): Promise<PlaylistFeed>;
}
