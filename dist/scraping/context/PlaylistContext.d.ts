import { Result } from "neverthrow";
import { ElementContext } from "./ElementContext";
type PlaylistEntry = {};
/**
 * Context for individual playlists.
 */
export declare class PlaylistContex extends ElementContext<PlaylistEntry> {
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string, PlaylistEntry>;
    }, Error[]>, any, unknown>;
}
export {};
