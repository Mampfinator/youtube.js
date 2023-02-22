import { Result } from "neverthrow";
import { ElementContext } from "./ElementContext";

type PlaylistEntry = {};

/**
 * Context for individual playlists.
 */
export class PlaylistContex extends ElementContext<PlaylistEntry> {
    protected getElements(): AsyncGenerator<
        Result<{ elements: Map<string, PlaylistEntry> }, Error[]>,
        any,
        unknown
    > {
        throw new Error("Method not implemented.");
    }
}
