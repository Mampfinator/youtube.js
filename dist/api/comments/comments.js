"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentEndpoints = void 0;
const neverthrow_1 = require("neverthrow");
const endpoints_1 = require("../endpoints");
const util_1 = require("../util");
class CommentEndpoints extends endpoints_1.YouTubeEndpoints {
    constructor(client) {
        super(client, "comments", [
            {
                for: "youtube#comment",
                transform(source) {
                    const replacers = {
                        snippet: (raw) => (0, util_1.mapProperties)(source.snippet, {
                            publishedAt: util_1.toDate,
                            updatedAt: util_1.toDate,
                        })
                    };
                    return Object.fromEntries(Object.entries(source)
                        .map(([key, value]) => [
                        key, replacers[key]?.(value) ?? value,
                    ]));
                }
            }
        ]);
    }
    async list(options) {
        const result = await this.client.get("comments", {
            query: {
                ...options,
            }
        });
        if (result.isErr())
            return (0, neverthrow_1.err)(result.error);
        const transformed = result.value.items.map(item => this.transform(item));
        return (0, neverthrow_1.ok)(transformed);
    }
}
exports.CommentEndpoints = CommentEndpoints;
