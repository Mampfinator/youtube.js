import { Result } from "neverthrow";
import { mix, Mixin } from "ts-mixer";
import { FetchError } from "../../scraping.interfaces";
import { Context } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Video = {}
/**
 * Channel context for `/videos`.
 */
@Context(getChannelTabRegex("videos"), 10)
export class VideosContext extends Mixin(ChannelTabContext, ElementContext<Video>) {
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, Video>; }, Error[]>, any, unknown> {
        throw new Error("Method not implemented.");
    }
}