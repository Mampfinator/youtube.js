"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeClient = void 0;
const constants_1 = require("./constants");
const videos_1 = require("./videos/videos");
const undici_1 = require("undici");
const path_1 = require("path");
const neverthrow_1 = require("neverthrow");
const errors_1 = require("./errors");
const util_1 = require("./util");
const channels_1 = require("./channels/channels");
const comments_1 = require("./comments/comments");
/**
 * YouTube client for all your needs.
 *
 * @example
 * ```ts
 * const client = new YouTubeClient({key: process.env.YOUTUBE_API_KEY})
 * ```
 */
class YouTubeClient extends undici_1.Client {
    videos = new videos_1.VideosEndpoints(this);
    channels = new channels_1.ChannelsEndpoints(this);
    comments = new comments_1.CommentEndpoints(this);
    key;
    callbackUrl;
    constructor(options) {
        super(constants_1.API_BASE_URL);
        this.key = options.key;
        this.callbackUrl = options.callbackUrl;
    }
    async fetch(options) {
        const response = await this.request({
            ...options,
            query: options.query ? { key: this.key, ...options.query } : {},
            body: options.body ? JSON.stringify(options.body) : null,
            path: `/${(0, path_1.join)("youtube", "v3" /* should be a constant, but YouTube will never update their API anyway- */, options.path)}`,
        });
        if ((0, errors_1.isError)(response.statusCode)) {
            const body = await response.body.json();
            return (0, neverthrow_1.err)(new errors_1.YouTubeAPIError(body));
        }
        return (0, neverthrow_1.ok)((await response.body.json()));
    }
    async get(path, options) {
        return this.fetch({
            path,
            method: "GET",
            ...(0, util_1.deepClearRecord)(options ?? {}), // this is a bodge, but it works for now
        });
    }
}
exports.YouTubeClient = YouTubeClient;
