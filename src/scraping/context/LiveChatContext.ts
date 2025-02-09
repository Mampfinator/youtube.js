import { DataExtractors } from "../extractors/data-extractors";
import { YOUTUBEI } from "../scraping.constants";
import { YtInitialData } from "../types";
import { Context } from "./decorators/Context";
import { ScrapingContext } from "./ScrapingContext";

@Context(/youtube\.com\/live_chat/)
export class LiveChatContext extends ScrapingContext {
    protected extract(body: string): { ytInitialData: YtInitialData; } {
        const result = DataExtractors.ytInitialData(body);
        if (result.isErr()) throw result.error;
        return { ytInitialData: result.value };
    }

    public getInitialActions() {
        return (this.data.ytInitialData as any)
            .continuationContents.liveChatContinuation
                .actions;
    }

    public getInitialContinuation(): { clickTrackingParams: string, continuation: string, timeoutMs: number } {
        return (this.data.ytInitialData as any).continuationContents.liveChatContinuation.continuations[0]
            .invalidationContinuationData;
    }

    public async getLiveChat(continuation: string, clickTrackingParams: string, visitorData: string) {
        return this.browse({
            useEndpoint: "live_chat/get_live_chat",
            token: continuation,
            clickTrackingParams,
            visitorData,
        });
    }
}