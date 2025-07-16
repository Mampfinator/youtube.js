"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortScraper = void 0;
const context_1 = require("./context");
const neverthrow_1 = require("neverthrow");
/**
 *
 */
class ShortScraper {
    factory;
    id;
    options;
    constructor(factory, id, options) {
        this.factory = factory;
        this.id = id;
        this.options = options;
    }
    context;
    async ensureContext(forceRefetch) {
        if (!forceRefetch && this.context !== undefined)
            return (0, neverthrow_1.ok)(this.context);
        let url = `https://youtube.com/shorts/${this.id}`;
        if (this.options?.query) {
            const query = new URLSearchParams(this.options.query);
            url += `?${query.toString()}`;
        }
        const context = await this.factory.fromUrl(url, context_1.ShortContext);
        if (context.isOk())
            this.context = context.value;
        return context;
    }
    async fetchComments() {
        const context = await this.ensureContext();
        if (context.isErr())
            return context;
        try {
            return (0, neverthrow_1.ok)(context.value.comments());
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
}
exports.ShortScraper = ShortScraper;
