import { YtInitialData, YtInitialPlayerResponse } from "../types/internal";
import { ScrapingContext } from "./ScrapingContext";
export declare class VideoPlayerContext extends ScrapingContext<{
    ytInitialData: YtInitialData;
    ytInitialPlayerResponse: YtInitialPlayerResponse;
}> {
    protected extract(body: string): {
        ytInitialData: YtInitialData;
        ytInitialPlayerResponse: YtInitialPlayerResponse;
    };
}
