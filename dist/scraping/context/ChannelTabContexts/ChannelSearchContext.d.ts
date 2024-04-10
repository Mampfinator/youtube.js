import { Result } from "neverthrow";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext } from "./ChannelTabContext";
declare const ChannelSearchContext_base: import("ts-mixer/dist/types/types").Class<any[], ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}> & ElementContext<any, string>, (abstract new (options: import("..").ContextOptions) => ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}>) & (abstract new (options: import("..").ContextOptions) => ElementContext<any, string>), false>;
/**
 * Channel context for `/search`.
 */
export declare class ChannelSearchContext extends ChannelSearchContext_base {
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string, any>;
    }, Error[]>, any, unknown>;
}
export {};
