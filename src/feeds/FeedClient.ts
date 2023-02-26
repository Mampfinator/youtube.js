import { XMLParser } from "fast-xml-parser";
import { YouTubeFeed } from "./types/internal";
import {
    BaseFeed,
    ChannelFeed,
    FeedType,
    PlaylistFeed,
} from "./types/external";
import { request } from "undici";
import { FEED_BASE_URL } from "./constants";

export class FeedClient {
    private readonly parser: XMLParser;

    constructor() {
        this.parser = new XMLParser({});
    }

    private parse(raw: string): BaseFeed {
        const { feed: rawFeed }: YouTubeFeed = this.parser.parse(raw);

        return {
            type:
                "yt:playlistId" in rawFeed
                    ? FeedType.Playlist
                    : FeedType.Channel,
            channel: {
                id: rawFeed["yt:channelId"], //? apparently Feed#yt:channelId is just always blank?
                ...rawFeed.author,
            },
            title: rawFeed.title,
            published: new Date(rawFeed.published),
            entries: rawFeed.entry.map(
                ({
                    "yt:videoId": id,
                    title,
                    published,
                    updated,
                    "media:group": { "media:description": description },
                }) => ({
                    id,
                    title,
                    description,
                    published: new Date(published),
                    updated: new Date(updated),
                }),
            ),
        };
    }

    public async forChannel(id: string): Promise<ChannelFeed> {
        return request(FEED_BASE_URL, { query: { channel_id: id } })
            .then(res => res.body.text())
            .then(text => this.parse(text) as ChannelFeed);
    }

    public async forPlaylist(id: string): Promise<PlaylistFeed> {
        return request(FEED_BASE_URL, { query: { playlist_id: id } })
            .then(res => res.body.text())
            .then(text => this.parse(text) as unknown as PlaylistFeed);
    }
}
