import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { Context } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

/**
 * Channel context for `/search`.
 */
@Context(getChannelTabRegex("search"), 10)
export class ChannelSearchContext extends Mixin(
    ChannelTabContext,
    ElementContext<any>,
) {
    protected async *getElements(): AsyncGenerator<
        Result<{ elements: Map<string, any> }, Error[]>,
        any,
        unknown
    > {
        throw new Error("Method not implemented.");
    }
}
