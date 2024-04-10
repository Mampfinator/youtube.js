import { ChannelTabContext } from "./ChannelTabContext";
import { ElementContext } from "../ElementContext";
import { Result } from "neverthrow";
type Playlist = {};
declare const ReleasesContext_base: import("ts-mixer/dist/types/types").Class<any[], ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}> & ElementContext<Playlist, string>, (abstract new (options: import("..").ContextOptions) => ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}>) & (abstract new (options: import("..").ContextOptions) => ElementContext<Playlist, string>), false>;
export declare class ReleasesContext extends ReleasesContext_base {
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string, Playlist>;
    }, Error[]>, any, unknown>;
}
export {};
