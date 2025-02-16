import { Result } from "neverthrow";
import { Action, YtInitialData } from "../types";
import { ScrapingContext } from "./ScrapingContext";
export declare class LiveChatContext extends ScrapingContext {
    protected extract(body: string): {
        ytInitialData: YtInitialData;
    };
    getInitialActions(): Action[];
    getInitialContinuation(): {
        clickTrackingParams: string;
        continuation: string;
        timeoutMs: number;
    };
    getLiveChat(continuation: string, clickTrackingParams: string, visitorData: string): Promise<Result<{
        continuationContents: {
            liveChatContinuation: {
                actions: Action[];
            };
        };
    }, Error>>;
}
