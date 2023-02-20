import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { FetchError } from "../../scraping.interfaces";
import { Context } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Short = {};
/**
 * Channel context for `/shorts`.
 */
@Context(getChannelTabRegex("shorts"), 10)
export class ShortsContext extends Mixin(ChannelTabContext, ElementContext<Short>) {
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, Short>; }, Error[]>, null, unknown> {
        throw new Error("Method not implemented.");
    }
}