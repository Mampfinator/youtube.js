import { Result } from "neverthrow";
import { FeaturedChannelSection } from "../../types";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext } from "./ChannelTabContext";
declare const ChannelsContext_base: import("ts-mixer/dist/types/types").Class<any[], ChannelTabContext<{
    ytInitialData: import("../../types").YtInitialData;
}> & ElementContext<FeaturedChannelSection, string | null>, (abstract new (options: import("..").ContextOptions) => ChannelTabContext<{
    ytInitialData: import("../../types").YtInitialData;
}>) & (abstract new (options: import("..").ContextOptions) => ElementContext<FeaturedChannelSection, string | null>), false>;
/**
 * Channel context for `/channels`.
 */
export declare class ChannelsContext extends ChannelsContext_base {
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string | null, FeaturedChannelSection>;
    }, Error[]>, any, unknown>;
}
export {};
