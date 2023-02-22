import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { Context } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Channel = {};

/**
 * Channel context for `/channels`.
 */
@Context(getChannelTabRegex("channels"), 10)
export class ChannelsContext extends Mixin(
    ChannelTabContext,
    ElementContext<Channel>,
) {
    protected async *getElements(): AsyncGenerator<
        Result<{ elements: Map<string, Channel> }, Error[]>,
        any,
        unknown
    > {
        throw new Error("Method not implemented.");
    }
}
