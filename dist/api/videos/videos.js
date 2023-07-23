"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosEndpoints = void 0;
const neverthrow_1 = require("neverthrow");
const endpoints_1 = require("../endpoints");
const errors_1 = require("../errors");
const util_1 = require("../util");
class VideosEndpoints extends endpoints_1.YouTubeEndpoints {
    constructor(client) {
        super(client, "videos", [
            {
                for: "youtube#video",
                transform(source) {
                    const entries = [
                        ["kind", source.kind],
                        ["etag", source.etag],
                        ["id", source.id],
                    ];
                    if (source.snippet) {
                        entries.push([
                            "snippet",
                            (0, util_1.mapProperties)(source.snippet, {
                                publishedAt: util_1.toDate,
                            }),
                        ]);
                    }
                    if (source.liveStreamingDetails) {
                        entries.push([
                            "liveStreamingDetails",
                            (0, util_1.mapProperties)(source.liveStreamingDetails, {
                                scheduledEndTime: util_1.toDateOpt,
                                actualEndTime: util_1.toDateOpt,
                                scheduledStartTime: util_1.toDateOpt,
                                actualStartTime: util_1.toDateOpt,
                            }),
                        ]);
                    }
                    if (source.status) {
                        entries.push([
                            "status",
                            (0, util_1.mapProperties)(source.status, {
                                publishAt: util_1.toDateOpt,
                            }),
                        ]);
                    }
                    if (source.contentDetails) {
                        entries.push([
                            "contentDetails",
                            (0, util_1.mapProperties)(source.contentDetails, {
                                caption: Boolean,
                            }),
                        ]);
                    }
                    return Object.fromEntries(entries);
                },
            },
        ]);
    }
    async list(options) {
        const { part, ids, mostPopular, myRating } = options;
        const result = await this.client.get("videos", {
            query: {
                part: Object.keys(part),
                id: ids?.join(","),
                chart: mostPopular ? "mostPopular" : undefined,
                myRating,
            },
        });
        if (result.isErr())
            return (0, neverthrow_1.err)(result.error);
        const transformed = result.value.items.map(item => this.transform(item));
        if (transformed.filter(v => v).length !== transformed.length)
            return (0, neverthrow_1.err)(new errors_1.YouTubeClientError());
        return (0, neverthrow_1.ok)(transformed);
    }
}
exports.VideosEndpoints = VideosEndpoints;
