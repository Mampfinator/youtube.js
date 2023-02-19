import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { FetchError } from "../../scraping.interfaces";
import { Match } from "../decorators/Match";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Short = {};
/**
 * Channel context for `/shorts`.
 */
@Match(getChannelTabRegex("shorts"), 10)
export class ShortsContext extends Mixin(ChannelTabContext, ElementContext<Short>) {
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, Short>; }, FetchError[]>, null, unknown> {
        throw new Error("Method not implemented.");
    }
}