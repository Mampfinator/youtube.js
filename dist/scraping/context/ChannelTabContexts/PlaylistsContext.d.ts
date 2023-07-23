import { Result } from "neverthrow";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext } from "./ChannelTabContext";
type Playlist = {};
declare const PlaylistsContext_base: import("ts-mixer/dist/types/types").Class<any[], ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}> & ElementContext<Playlist>, (abstract new (options: import("..").ContextOptions) => ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}>) & (abstract new (options: import("..").ContextOptions) => ElementContext<Playlist>), false>;
/**
 * channel context for `/playlists`.
 */
export declare class PlaylistsContext extends PlaylistsContext_base {
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string, Playlist>;
    }, Error[]>, any, unknown>;
}
export {};
