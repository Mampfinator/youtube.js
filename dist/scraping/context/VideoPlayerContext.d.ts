import { YtInitialData, YtInitialPlayerResponse } from "../types/internal";
import { ScrapingContext } from "./ScrapingContext";
export declare enum ChatType {
    Top = 0,
    Live = 1
}
export declare class VideoPlayerContext extends ScrapingContext<{
    ytInitialData: YtInitialData;
    ytInitialPlayerResponse: YtInitialPlayerResponse;
}> {
    protected extract(body: string): {
        ytInitialData: YtInitialData;
        ytInitialPlayerResponse: YtInitialPlayerResponse;
    };
    private continuation;
    private clickTrackingParams;
    getLiveChatContinuation(chatType?: ChatType): [{
        coninuation: string;
        clickTrackingParams: string;
    }, string] | null;
}
