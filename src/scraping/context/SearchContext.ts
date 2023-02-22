import { Result } from "neverthrow";
import { ElementContext } from "./ElementContext";

type SearchResult = {};

/**
 * Context for /results (aka search).
 */
export class SearchContext extends ElementContext<SearchResult> {
    protected getElements(): AsyncGenerator<
        Result<{ elements: Map<string, SearchResult> }, Error[]>,
        any,
        unknown
    > {
        throw new Error("Method not implemented.");
    }
}
