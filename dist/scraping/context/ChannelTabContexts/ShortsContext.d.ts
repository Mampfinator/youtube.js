import { Result } from "neverthrow";
import { ScrapedShort } from "../../types";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext } from "./ChannelTabContext";
declare const ShortsContext_base: import("ts-mixer/dist/types/types").Class<any[], ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}> & ElementContext<ScrapedShort, string>, (abstract new (options: import("..").ContextOptions) => ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}>) & (abstract new (options: import("..").ContextOptions) => ElementContext<ScrapedShort, string>)>;
/**
 * Channel context for `/shorts`.
 */
export declare class ShortsContext extends ShortsContext_base {
    private toShorts;
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string, ScrapedShort>;
    }, Error[]>, undefined, unknown>;
    fetchComments(): Promise<Comment[]>;
}
export {};
