import { Result } from "neverthrow";
import { mix, Mixin } from "ts-mixer";
import { FetchError } from "../../scraping.interfaces";
import { Match } from "../decorators/Match";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Channel = {}

/**
 * Channel context for `/channels`.
 */
@Match(getChannelTabRegex("channels"), 10)
export class ChannelsContext extends Mixin(ChannelTabContext, ElementContext<Channel>) {
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, Channel>; }, FetchError[]>, any, unknown> {
        throw new Error("Method not implemented.");
    }
}