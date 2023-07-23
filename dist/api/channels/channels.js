"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsEndpoints = void 0;
const neverthrow_1 = require("neverthrow");
const endpoints_1 = require("../endpoints");
const errors_1 = require("../errors");
const util_1 = require("../util");
class ChannelsEndpoints extends endpoints_1.YouTubeEndpoints {
    constructor(client) {
        super(client, "channels", [
            {
                for: "youtube#channel",
                transform(source) {
                    const replacers = {
                        snippet: (raw) => (0, util_1.mapProperties)(source.snippet, {
                            publishedAt: util_1.toDate,
                        }),
                        contentOwnerDetails: (raw) => (0, util_1.mapProperties)(source.contentOwnerDetails, {
                            timeLinked: util_1.toDate,
                        }),
                    };
                    const entries = Object.entries(source).map(([key, value]) => [
                        key,
                        replacers[key]?.(value) ?? value,
                    ]);
                    return Object.fromEntries(entries);
                },
            },
        ]);
    }
    async list(options) {
        const { part, hl, maxResults, pageToken, categoryId, forUsername, ids, managedByMe, mine, } = options;
        const result = await this.client.get("channels", {
            query: {
                part: Object.keys(part ?? {}),
                id: ids?.join(","),
                hl,
                maxResults,
                pageToken,
                categoryId,
                forUsername,
                managedByMe,
                mine,
            },
        });
        if (result.isErr())
            return (0, neverthrow_1.err)(result.error);
        const transformed = result.value.items.map(item => this.transform(item));
        if (transformed.filter(c => c).length !== transformed.length)
            return (0, neverthrow_1.err)(new errors_1.YouTubeClientError());
        return (0, neverthrow_1.ok)(transformed);
    }
}
exports.ChannelsEndpoints = ChannelsEndpoints;
