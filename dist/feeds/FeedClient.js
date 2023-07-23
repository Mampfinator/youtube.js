"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedClient = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const external_1 = require("./types/external");
const undici_1 = require("undici");
const constants_1 = require("./constants");
class FeedClient {
    parser;
    constructor() {
        this.parser = new fast_xml_parser_1.XMLParser({});
    }
    parse(raw) {
        const { feed: rawFeed } = this.parser.parse(raw);
        return {
            type: "yt:playlistId" in rawFeed
                ? external_1.FeedType.Playlist
                : external_1.FeedType.Channel,
            channel: {
                id: rawFeed["yt:channelId"],
                ...rawFeed.author,
            },
            title: rawFeed.title,
            published: new Date(rawFeed.published),
            entries: rawFeed.entry.map(({ "yt:videoId": id, title, published, updated, "media:group": { "media:description": description }, }) => ({
                id,
                title,
                description,
                published: new Date(published),
                updated: new Date(updated),
            })),
        };
    }
    async forChannel(id) {
        return (0, undici_1.request)(constants_1.FEED_BASE_URL, { query: { channel_id: id } })
            .then(res => res.body.text())
            .then(text => this.parse(text));
    }
    async forPlaylist(id) {
        return (0, undici_1.request)(constants_1.FEED_BASE_URL, { query: { playlist_id: id } })
            .then(res => res.body.text())
            .then(text => this.parse(text));
    }
}
exports.FeedClient = FeedClient;
