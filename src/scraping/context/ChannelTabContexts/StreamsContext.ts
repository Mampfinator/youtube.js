import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Stream = {};
/**
 * Channel context for `/streams`.
 */
@Context(getChannelTabRegex("streams"), DEFAULT_WEIGHT+1)
export class StreamsContext extends Mixin(
    ChannelTabContext,
    ElementContext<Stream>,
) {
    protected async *getElements(): AsyncGenerator<
        Result<{ elements: Map<string, Stream> }, Error[]>,
        any,
        unknown
    > {
        throw new Error("Method not implemented.");
    }
}
