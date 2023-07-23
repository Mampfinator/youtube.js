import { Result } from "neverthrow";
import { ScrapingContext } from "./ScrapingContext";
/**
 * Base class for contexts that focus on collections of elements (like playlists, community tabs, live tabs, ...)
 */
export declare abstract class ElementContext<TElement extends object> extends ScrapingContext<any> {
    protected readonly elements: Map<string, TElement>;
    /**
     * Collect current elements
     * @returns all current known elements.
     */
    get(): Map<string, TElement>;
    protected abstract getElements(): AsyncGenerator<Result<{
        elements: Map<string, TElement>;
    }, Error[]>>;
    fetchElements(amount?: number): Promise<Result<void, Error[]>>;
}
