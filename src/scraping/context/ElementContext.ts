import { err, ok, Result } from "neverthrow";
import { ScrapingContext } from "./ScrapingContext";

/**
 * Base class for contexts that focus on collections of elements (like playlists, community tabs, live tabs, ...)
 */
export abstract class ElementContext<
    TElement extends object,
> extends ScrapingContext<any> {
    protected readonly elements = new Map<string, TElement>();

    /**
     * Collect current elements
     * @returns all current known elements.
     */
    public get(): Map<string, TElement> {
        return new Map([...this.elements]);
    }

    protected abstract getElements(): AsyncGenerator<
        Result<{ elements: Map<string, TElement> }, Error[]>
    >;

    // TODO: implement `fetchRecent` methods to `ChannelScraper`.
    public async fetchElements(amount?: number): Promise<Result<void, Error[]>> {
        for await (const result of this.getElements()) {
            if (result.isErr()) return err(result.error);

            for (const [key, value] of result.value.elements) {
                this.elements.set(key, value);

                if (amount !== undefined && this.elements.size >= amount) return ok(undefined);
            }
        }

        return ok(undefined);
    }
}
