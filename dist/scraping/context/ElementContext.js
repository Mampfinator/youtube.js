"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementContext = void 0;
const neverthrow_1 = require("neverthrow");
const ScrapingContext_1 = require("./ScrapingContext");
/**
 * Base class for contexts that focus on collections of elements (like playlists, community tabs, live tabs, ...)
 */
class ElementContext extends ScrapingContext_1.ScrapingContext {
    elements = new Map();
    /**
     * Collect current elements
     * @returns all current known elements.
     */
    get() {
        return new Map([...this.elements]);
    }
    // TODO: implement `fetchRecent` methods to `ChannelScraper`.
    async fetchElements(amount) {
        for await (const result of this.getElements()) {
            if (result.isErr())
                return (0, neverthrow_1.err)(result.error);
            for (const [key, value] of result.value.elements) {
                this.elements.set(key, value);
                if (amount !== undefined && this.elements.size >= amount)
                    return (0, neverthrow_1.ok)(undefined);
            }
        }
        return (0, neverthrow_1.ok)(undefined);
    }
}
exports.ElementContext = ElementContext;
