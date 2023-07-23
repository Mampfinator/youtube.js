import { Result } from "neverthrow";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext } from "./ChannelTabContext";
type StoreItem = {};
declare const StoreContext_base: import("ts-mixer/dist/types/types").Class<any[], ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}> & ElementContext<StoreItem>, (abstract new (options: import("..").ContextOptions) => ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}>) & (abstract new (options: import("..").ContextOptions) => ElementContext<StoreItem>), false>;
/**
 * Channel context for `/store`.
 */
export declare class StoreContext extends StoreContext_base {
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string, StoreItem>;
    }, Error[]>, any, unknown>;
}
export {};
