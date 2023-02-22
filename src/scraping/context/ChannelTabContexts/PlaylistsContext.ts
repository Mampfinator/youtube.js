import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { Context } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Playlist = {};
/**
 * channel context for `/playlists`.
 */
@Context(getChannelTabRegex("playlists"), 10)
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
