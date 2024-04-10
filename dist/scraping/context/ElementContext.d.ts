import { Result } from "neverthrow";
import { ScrapingContext } from "./ScrapingContext";
/**
 * Base class for contexts that focus on collections of elements (like playlists, community tabs, live tabs, ...)
 */
export declare abstract class ElementContext<TElement extends object, TKey = string> extends ScrapingContext<any> {
    protected readonly elements: Map<TKey, TElement>;
    /**
     * Collect current elements
     * @returns all current known elements.
     */
    get(): Map<TKey, TElement>;
    protected abstract getElements(): AsyncGenerator<Result<{
        elements: Map<TKey, TElement>;
    }, Error[]>>;
    fetchElements(amount?: number): Promise<Result<void, Error[]>>;
}
