import { Result } from "neverthrow";
import { DataExtractors } from "../extractors/data-extractors";
import { YOUTUBEI } from "../scraping.constants";
import { Action, YtInitialData } from "../types";
import { Context } from "./decorators/Context";
import { ScrapingContext } from "./ScrapingContext";

@Context(/youtube\.com\/live_chat/)
export class LiveChatContext extends ScrapingContext {
    private live: boolean | undefined;

    public setIsLive(live: boolean) {
        this.live = live;
    }

    public getIsLive(): boolean {
        return this.live ?? false;
    }

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
            // there are *so* many different barely nuanced keys for the different containers, but they all follow the same form - so this will be fine.
            return continuationContainer[Object.keys(continuationContainer)[0]];
    }

    public async getLiveChat(continuation: string, clickTrackingParams: string, visitorData: string, playerOffsetMs?: number): Promise<Result<{ continuationContents: { liveChatContinuation: { actions: Action[] } } }, Error>> {
        return this.browse({
            useEndpoint: `live_chat/get_live_chat${this.live ? "" : "_replay"}`,
            token: continuation,
            clickTrackingParams,
            visitorData,
            playerOffsetMs: playerOffsetMs !== undefined ? String(playerOffsetMs) : undefined,
        }) as unknown as Result<{ continuationContents: { liveChatContinuation: { actions: Action[] } } }, Error>;
    }
}