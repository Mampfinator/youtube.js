"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostScraper = void 0;
const neverthrow_1 = require("neverthrow");
const context_1 = require("./context");
class PostScraper {
    factory;
    id;
    options;
    post;
    channelData;
    context;
    constructor(factory, id, options) {
        this.factory = factory;
        this.id = id;
        this.options = options;
    }
    async ensureContext(forceRefetch) {
        if (!forceRefetch && this.context !== undefined)
            return (0, neverthrow_1.ok)(this.context);
        let url = `https://youtube.com/post/${this.id}`;
        if (this.options?.query) {
            const query = new URLSearchParams(this.options.query);
            url += `?${query.toString()}`;
        }
        const context = await this.factory.fromUrl(url, context_1.CommunityPostContext);
        if (context.isOk())
            this.context = context.value;
        return context;
    }
    /**
     * @param forceRefetch if true, will fetch data from YouTube even if there's a post cached.
     */
    async getPost(forceRefetch) {
        if (!forceRefetch && this.post !== undefined)
            return (0, neverthrow_1.ok)(this.post);
        const context = await this.ensureContext(forceRefetch);
        if (context.isErr())
            return context;
        const post = context.value.getPost();
        if (post.isOk())
            this.post = post.value;
        return post;
    }
    /**
     * @param forceRefetch if true, will fetch data from YouTube even if there's channel data cached.
     */
    async getChannelData(forceRefetch) {
        if (!forceRefetch && this.channelData !== undefined)
            return (0, neverthrow_1.ok)(this.channelData);
        const context = await this.ensureContext(forceRefetch);
        if (context.isErr())
            return context;
        const channel = context.value.getChannelData();
        if (channel.isOk())
            this.channelData = channel.value;
        return channel;
    }
    async fetchComments() {
        const context = await this.ensureContext();
        if (context.isErr())
            return context;
        try {
            const comments = context.value.comments();
            return (0, neverthrow_1.ok)(comments);
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
}
exports.PostScraper = PostScraper;
