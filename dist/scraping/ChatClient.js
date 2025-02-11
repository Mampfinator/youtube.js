"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatClient = void 0;
const util_1 = require("../shared/util");
const context_1 = require("./context");
class ChatClient {
    scraper;
    context;
    streamId;
    visitorData;
    constructor(scraper, context, streamId, visitorData) {
        this.scraper = scraper;
        this.context = context;
        this.streamId = streamId;
        this.visitorData = visitorData;
    }
    /**
     * Attempt to instantiate a `ChatClient` from a stream ID. If the video is not a current or past live stream, or no video with the given ID exists,
     * an error will be thrown.
     */
    static async fromStreamId(scraper, streamId) {
        const videoContext = await scraper.contexts.fromUrl(`https://youtube.com/watch?v=${streamId}`, context_1.VideoPlayerContext);
        if (videoContext.isErr())
            throw videoContext.error;
        const [initialContinuation, visitorData] = videoContext.value.getLiveChatContinuation();
        if (initialContinuation === null) {
            throw new Error("Live chat not available");
        }
        const liveChatContext = await scraper.contexts.fromUrl(`https://youtube.com/live_chat?continuation=${initialContinuation}`, context_1.LiveChatContext);
        if (liveChatContext.isErr())
            throw liveChatContext.error;
        return new ChatClient(scraper, liveChatContext.value, streamId, visitorData);
    }
    async *read() {
        for (const action of this.context.getInitialActions()) {
            yield action;
        }
        let { clickTrackingParams, continuation, timeoutMs, } = this.context.getInitialContinuation();
        while (true) {
            await (0, util_1.sleep)(timeoutMs);
            const result = await this.context.getLiveChat(continuation, clickTrackingParams, this.visitorData);
            if (result.isErr())
                throw result.error;
            for (const action of result.value.continuationContents.liveChatContinuation.actions) {
                yield action;
            }
            const { clickTrackingParams: nextClickTrackingParams, continuation: nextContinuation, timeoutMs: nextTimeoutMs } = result.value.continuationContents.liveChatContinuation.continuations[0].invalidationContinuationData;
            clickTrackingParams = nextClickTrackingParams;
            continuation = nextContinuation;
            timeoutMs = nextTimeoutMs;
        }
    }
}
exports.ChatClient = ChatClient;
