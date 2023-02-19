import { Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { FetchError } from "../../scraping.interfaces";
import { Match } from "../decorators/Match";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

type Playlist = {}
/**
 * channel context for `/playlists`.
 */
@Match(getChannelTabRegex("playlists"), 10)
export class PlaylistsContext extends Mixin(ChannelTabContext, ElementContext<Playlist>) {
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, Playlist>; }, FetchError[]>, any, unknown> {
        throw new Error("Method not implemented.");
    }
}