"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingClient = void 0;
const RequestOrchestrator_1 = require("./RequestOrchestrator");
const context_1 = require("./context");
const ChannelScraper_1 = require("./ChannelScraper");
const PostScraper_1 = require("./PostScraper");
const ChatClient_1 = require("./ChatClient");
const ShortScraper_1 = require("./ShortScraper");
const VideoScraper_1 = require("./VideoScraper");
class ScrapingClient {
    orchestrator;
    contexts;
    constructor(options) {
        this.orchestrator =
            options?.useOrchestrator ?? new RequestOrchestrator_1.RequestOrchestrator();
        this.contexts = new context_1.ContextFactory(this.orchestrator);
    }
    /**
     * Initializes the client (and the request orchestrator). Needs to be called before anything else.
     */
    async init() {
        const orchestatorInit = await this.orchestrator.init?.();
        if (orchestatorInit && orchestatorInit.isErr()) {
            throw orchestatorInit.error;
        }
    }
    /**
     * Cleans up and calls `destroy` on the orchestrator, if present.
     */
    async destroy() {
        await this.orchestrator.destroy?.();
    }
    /**
     * @returns - a collection of channel-specific methods.
     */
    channel(options) {
        return new ChannelScraper_1.ChannelScraper(this.contexts, options);
    }
    /**
     * @returns - a collection of community post-specific methods.
     */
    post(id, linkedComment) {
        return new PostScraper_1.PostScraper(this.contexts, id, linkedComment ? { query: { lc: linkedComment } } : undefined);
    }
    async chat(streamId) {
        return ChatClient_1.ChatClient.fromStreamId(this, streamId);
    }
    video(videoId, linkedComment) {
        return new VideoScraper_1.VideoScraper(this.contexts, videoId, linkedComment ? { query: { lc: linkedComment } } : undefined);
    }
    short(shortId, linkedComment) {
        return new ShortScraper_1.ShortScraper(this.contexts, shortId, linkedComment ? { query: { lc: linkedComment } } : undefined);
    }
}
exports.ScrapingClient = ScrapingClient;
