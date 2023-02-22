import { Result } from "neverthrow";
import { FetchError } from "../scraping.interfaces";
import { ElementContext } from "./ElementContext";
import { ScrapingContext } from "./ScrapingContext";

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
