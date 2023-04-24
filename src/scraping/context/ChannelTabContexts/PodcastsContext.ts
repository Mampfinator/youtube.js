import { Mixin } from "ts-mixer";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";
import { ElementContext } from "../ElementContext";
import { Result } from "neverthrow";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";

/**
 * PLACEHOLDER
 */
type Playlist = {};

/**
 * Channel context for `/podcasts`.
 */
@Context(getChannelTabRegex("podcasts"), DEFAULT_WEIGHT + 1)
export class PodcastsContext extends Mixin(
    ChannelTabContext,
    ElementContext<Playlist>
) {
    protected getElements(): AsyncGenerator<Result<{ elements: Map<string, Playlist>; }, Error[]>, any, unknown> {
        throw new Error("Method not implemented.");
    }
}