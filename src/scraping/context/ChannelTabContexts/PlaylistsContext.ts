import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTab, ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Playlist = {};
/**
 * channel context for `/playlists`.
 */
@Context(getChannelTabRegex(ChannelTab.Playlists), DEFAULT_WEIGHT + 1)
export class PlaylistsContext extends Mixin(
    ChannelTabContext,
    ElementContext<Playlist>,
) {
    protected async *getElements(): AsyncGenerator<
        Result<{ elements: Map<string, Playlist> }, Error[]>,
        any,
        unknown
    > {
        throw new Error("Method not implemented.");
    }
}
