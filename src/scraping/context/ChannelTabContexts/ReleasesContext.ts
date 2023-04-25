import { Mixin } from "ts-mixer";
import {
    ChannelTab,
    ChannelTabContext,
    getChannelTabRegex,
} from "./ChannelTabContext";
import { ElementContext } from "../ElementContext";
import { Result } from "neverthrow";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";

type Playlist = {};

@Context(getChannelTabRegex(ChannelTab.Releases), DEFAULT_WEIGHT + 1)
export class ReleasesContext extends Mixin(
    ChannelTabContext,
    ElementContext<Playlist>,
) {
    protected getElements(): AsyncGenerator<
        Result<{ elements: Map<string, Playlist> }, Error[]>,
        any,
        unknown
    > {
        throw new Error("Method not implemented.");
    }
}
