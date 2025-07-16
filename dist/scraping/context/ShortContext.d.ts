import { YtInitialData, YtInitialPlayerResponse } from "../types";
import { ScrapingContext } from "./ScrapingContext";
import { CommentFetcher } from "../CommentFetcher";
export declare class ShortContext extends ScrapingContext<{
    ytInitialData: YtInitialData;
    ytInitialPlayerResponse: YtInitialPlayerResponse;
}> {
    protected extract(body: string): {
        ytInitialData: YtInitialData;
        ytInitialPlayerResponse: YtInitialPlayerResponse;
    };
    comments(): CommentFetcher;
}
