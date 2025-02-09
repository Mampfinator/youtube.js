import { sleep } from "../shared/util";
import { LiveChatContext, VideoPlayerContext } from "./context";
import { YOUTUBEI } from "./scraping.constants";
import { ScrapingClient } from "./ScrapingClient";

export type ChatMessage = {

}

export class ChatClient {
    private constructor(
        public readonly scraper: ScrapingClient,
        public readonly context: LiveChatContext,
        public readonly streamId: string,
        private readonly visitorData: string,
    ) {}

    /**
     * Attempt to instantiate a `ChatClient` from a stream ID. If the video is not a current or past live stream, or no video with the given ID exists,
     * an error will be thrown.
     */
    public static async fromStreamId(scraper: ScrapingClient, streamId: string): Promise<ChatClient> {
        const videoContext = await scraper.contexts.fromUrl(
            `https://youtube.com/watch?v=${streamId}`,
            VideoPlayerContext
        );

        if (videoContext.isErr()) throw videoContext.error;

        const [initialContinuation, visitorData] = videoContext.value.getLiveChatContinuation()!;

        if (initialContinuation === null) {
            throw new Error("Live chat not available");
        }

        const liveChatContext = await scraper.contexts.fromUrl(
            `https://youtube.com/live_chat?continuation=${initialContinuation}`,
            LiveChatContext,
        );

        if (liveChatContext.isErr()) throw liveChatContext.error;

        console.log(liveChatContext.value);

        return new ChatClient(scraper, liveChatContext.value, streamId, visitorData);
    }

    public async *read() {
        for (const action of this.context.getInitialActions()) {
            yield action;
        }

        let {
            clickTrackingParams,
            continuation,
            timeoutMs,
        } = this.context.getInitialContinuation();

        while (true) {
            await sleep(timeoutMs);

            const result = await this.context.getLiveChat(continuation, clickTrackingParams, this.visitorData);
            if (result.isErr()) throw result.error;
            
            for (const action of (result.value as any).continuationContents.liveChatContinuation.actions) {
                yield action;
            }

            const { clickTrackingParams: nextClickTrackingParams, continuation: nextContinuation, timeoutMs: nextTimeoutMs } =
                (result.value as any).continuationContents.liveChatContinuation.continuations[0].invalidationContinuationData;

            clickTrackingParams = nextClickTrackingParams;
            continuation = nextContinuation;
            timeoutMs = nextTimeoutMs;
        }
    }
}