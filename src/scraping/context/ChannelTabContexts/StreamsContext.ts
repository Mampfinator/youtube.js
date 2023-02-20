import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { FetchError } from "../../scraping.interfaces";
import { Context } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Stream = {}
/**
 * Channel context for `/streams`.
 */
@Context(getChannelTabRegex("streams"), 10)
export class StreamsContext extends Mixin(ChannelTabContext<any>, ElementContext<Stream>) {
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, Stream>; }, Error[]>, any, unknown> {
        throw new Error("Method not implemented.");
    }
}