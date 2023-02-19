import { ok, Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { FetchError } from "../../scraping.interfaces";
import { Match } from "../decorators/Match";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type CommunityPost = {}
/**
 * Channel context for /community.
 */
@Match(getChannelTabRegex("community"), 10)
export class CommunityContext extends Mixin(ChannelTabContext, ElementContext<CommunityPost>) {
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, CommunityPost>; }, FetchError[]>, any, unknown> {}

}