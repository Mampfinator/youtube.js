import { Result } from "neverthrow";
import { FetchError } from "../scraping.interfaces";
import { ElementContext } from "./ElementContext";
import { ScrapingContext } from "./ScrapingContext";

type SearchResult = {}

/**
 * Context for /results (aka search).
 */
export class SearchContext extends ElementContext<SearchResult> {
    protected getElements(): AsyncGenerator<Result<{ elements: Map<string, SearchResult>; }, Error[]>, any, unknown> {
        throw new Error("Method not implemented.");
    }

}