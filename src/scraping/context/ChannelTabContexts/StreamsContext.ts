import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { FetchError } from "../../scraping.interfaces";
import { Match } from "../decorators/Match";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Stream = {}
/**
 * Channel context for `/streams`.
 */
@Match(getChannelTabRegex("streams"), 10)
export class StreamsContext extends Mixin(ChannelTabContext<any>, ElementContext<Stream>) {
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, Stream>; }, FetchError[]>, any, unknown> {
        throw new Error("Method not implemented.");
    }
}