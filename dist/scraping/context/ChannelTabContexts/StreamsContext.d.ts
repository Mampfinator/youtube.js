import { Result } from "neverthrow";
import { ScrapedStream } from "../../types";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext } from "./ChannelTabContext";
declare const StreamsContext_base: import("ts-mixer/dist/types/types").Class<any[], ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}> & ElementContext<ScrapedStream, string>, (abstract new (options: import("..").ContextOptions) => ChannelTabContext<{
    ytInitialData: import("../..").YtInitialData;
}>) & (abstract new (options: import("..").ContextOptions) => ElementContext<ScrapedStream, string>)>;
/**
 * Channel context for `/streams`.
 */
export declare class StreamsContext extends StreamsContext_base {
    private toStreams;
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string, ScrapedStream>;
    }, Error[]>, any, unknown>;
}
export {};
