import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import {
    ChannelTab,
    ChannelTabContext,
    getChannelTabRegex,
} from "./ChannelTabContext";

/**
 * Channel context for `/search`.
 */
@Context(getChannelTabRegex(ChannelTab.Search), DEFAULT_WEIGHT + 1)
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
