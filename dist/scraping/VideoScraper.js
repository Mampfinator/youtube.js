"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoScraper = void 0;
const context_1 = require("./context");
const neverthrow_1 = require("neverthrow");
/**
 *
 */
class VideoScraper {
    factory;
    id;
    options;
    constructor(factory, id, options) {
        this.factory = factory;
        this.id = id;
        this.options = options;
    }
    context;
    async ensureContext(forceRefetch) {
        if (!forceRefetch && this.context !== undefined)
            return (0, neverthrow_1.ok)(this.context);
        const query = { ...(this.options?.query ?? {}), ...{ id: this.id } };
        const url = `https://youtube.com/watch?${new URLSearchParams(query).toString()}`;
        const context = await this.factory.fromUrl(url, context_1.VideoPlayerContext);
        if (context.isOk())
            this.context = context.value;
        return context;
    }
    async fetchComments() {
        const context = await this.ensureContext();
        if (context.isErr())
            return context;
        try {
            return (0, neverthrow_1.ok)(context.value.comments());
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
}
exports.VideoScraper = VideoScraper;
