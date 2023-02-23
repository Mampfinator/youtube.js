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

    public async fetchAll(): Promise<Result<void, Error[]>> {
        for await (const result of this.getElements()) {
            if (result.isErr()) return err(result.error);

            for (const [key, value] of result.value.elements) {
                this.elements.set(key, value);
            }
        }

        return ok(undefined);
    }
}
