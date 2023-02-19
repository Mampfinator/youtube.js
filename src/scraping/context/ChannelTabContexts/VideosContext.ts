import { Result } from "neverthrow";
import { mix, Mixin } from "ts-mixer";
import { FetchError } from "../../scraping.interfaces";
import { Match } from "../decorators/Match";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Video = {}
/**
 * Channel context for `/videos`.
 */
@Match(getChannelTabRegex("videos"), 10)
export class VideosContext extends Mixin(ChannelTabContext, ElementContext<Video>) {
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, Video>; }, FetchError[]>, any, unknown> {
        throw new Error("Method not implemented.");
    }
}