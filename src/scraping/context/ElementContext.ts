import { err, ok, Result } from "neverthrow";
import { ScrapingContext } from "./ScrapingContext";

/**
 * Base class for contexts that focus on collections of elements (like playlists, community tabs, live tabs, ...)
 */
export abstract class ElementContext<
    TElement extends object,
    TKey = string,
> extends ScrapingContext<any> {
    protected readonly elements = new Map<TKey, TElement>();

    /**
     * Collect current elements
     * @returns all current known elements.
     */
    public get(): Map<TKey, TElement> {
        return new Map([...this.elements]);
    }

    protected abstract getElements(): AsyncGenerator<
        Result<{ elements: Map<TKey, TElement> }, Error[]>
    >;

    // TODO: implement `fetchRecent` methods to `ChannelScraper`.
    public async fetchElements(
        amount?: number,
    ): Promise<Result<void, Error[]>> {
        for await (const result of this.getElements()) {
            if (result.isErr()) return err(result.error);

            for (const [key, value] of result.value.elements) {
                this.elements.set(key, value);

                if (amount !== undefined && this.elements.size >= amount)
                    return ok(undefined);
            }
        }

        return ok(undefined);
    }
}
