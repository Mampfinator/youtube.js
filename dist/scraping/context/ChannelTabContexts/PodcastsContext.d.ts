import { ChannelTabContext } from "./ChannelTabContext";
import { ElementContext } from "../ElementContext";
import { Result } from "neverthrow";
/**
 * PLACEHOLDER
 */
type Playlist = {};
declare const PodcastsContext_base: import("ts-mixer/dist/types/types").Class<any[], ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}> & ElementContext<Playlist>, (abstract new (options: import("..").ContextOptions) => ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}>) & (abstract new (options: import("..").ContextOptions) => ElementContext<Playlist>), false>;
/**
 * Channel context for `/podcasts`.
 */
export declare class PodcastsContext extends PodcastsContext_base {
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string, Playlist>;
    }, Error[]>, any, unknown>;
}
export {};
