import { Result } from "neverthrow";
import { DataExtractors } from "../extractors/data-extractors";
import { YOUTUBEI } from "../scraping.constants";
import { Action, YtInitialData } from "../types";
import { Context } from "./decorators/Context";
import { ScrapingContext } from "./ScrapingContext";

@Context(/youtube\.com\/live_chat/)
export class LiveChatContext extends ScrapingContext {
    protected extract(body: string): { ytInitialData: YtInitialData; } {
        const result = DataExtractors.ytInitialData(body);
        if (result.isErr()) throw result.error;
        return { ytInitialData: result.value };
    }

    public getInitialActions(): Action[] {
        return (this.data.ytInitialData as any)
            .continuationContents.liveChatContinuation
                .actions;
    }

    public getInitialContinuation(): { clickTrackingParams: string, continuation: string, timeoutMs: number } {
        const continuationContainer = (this.data.ytInitialData as any).continuationContents.liveChatContinuation.continuations[0]
            return continuationContainer.invalidationContinuationData ?? continuationContainer.timedContinuationData;
    }

    public async getLiveChat(continuation: string, clickTrackingParams: string, visitorData: string): Promise<Result<{ continuationContents: { liveChatContinuation: { actions: Action[] } } }, Error>> {
        return this.browse({
            useEndpoint: "live_chat/get_live_chat",
            token: continuation,
            clickTrackingParams,
            visitorData,
        }) as unknown as Result<{ continuationContents: { liveChatContinuation: { actions: Action[] } } }, Error>;
    }
}