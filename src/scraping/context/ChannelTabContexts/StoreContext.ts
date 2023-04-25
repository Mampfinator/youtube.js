import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTab, ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type StoreItem = {};

/**
 * Channel context for `/store`.
 */
@Context(getChannelTabRegex(ChannelTab.Store), DEFAULT_WEIGHT + 1)
export class StoreContext extends Mixin(
    ChannelTabContext,
    ElementContext<StoreItem>,
) {
    // TODO: implement store parsing

    protected getElements(): AsyncGenerator<
        Result<{ elements: Map<string, StoreItem> }, Error[]>,
        any,
        unknown
    > {
        throw new Error("Method not implemented.");
    }
}
