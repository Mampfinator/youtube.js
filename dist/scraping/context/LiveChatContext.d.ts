import { Result } from "neverthrow";
import { Action, YtInitialData } from "../types";
import { ScrapingContext } from "./ScrapingContext";
export declare class LiveChatContext extends ScrapingContext {
    private live;
    setIsLive(live: boolean): void;
    getIsLive(): boolean;
    protected extract(body: string): {
        ytInitialData: YtInitialData;
    };
    getInitialActions(): Action[];
    getInitialContinuation(): {
        clickTrackingParams: string;
        continuation: string;
        timeoutMs: number;
    };
    getLiveChat(continuation: string, clickTrackingParams: string, visitorData: string, playerOffsetMs?: number): Promise<Result<{
        continuationContents: {
            liveChatContinuation: {
                actions: Action[];
            };
        };
    }, Error>>;
}
