import { Result } from "neverthrow";
import { ScrapedVideo } from "../../types";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext } from "./ChannelTabContext";
declare const VideosContext_base: import("ts-mixer/dist/types/types").Class<any[], ChannelTabContext<{
    ytInitialData: import("../../types").YtInitialData;
}> & ElementContext<ScrapedVideo, string>, (abstract new (options: import("..").ContextOptions) => ChannelTabContext<{
    ytInitialData: import("../../types").YtInitialData;
}>) & (abstract new (options: import("..").ContextOptions) => ElementContext<ScrapedVideo, string>), false>;
/**
 * Channel context for `/videos`.
 */
export declare class VideosContext extends VideosContext_base {
    private toVideos;
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string, ScrapedVideo>;
    }, Error[]>, any, unknown>;
}
export {};
