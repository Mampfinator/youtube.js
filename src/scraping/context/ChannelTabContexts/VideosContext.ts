import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Video = {};
/**
 * Channel context for `/videos`.
 */
@Context(getChannelTabRegex("videos"), DEFAULT_WEIGHT+1)
export class VideosContext extends Mixin(
    ChannelTabContext,
    ElementContext<Video>,
) {
    protected async *getElements(): AsyncGenerator<
        Result<{ elements: Map<string, Video> }, Error[]>,
        any,
        unknown
    > {
        throw new Error("Method not implemented.");
    }
}
