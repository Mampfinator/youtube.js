"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchContext = void 0;
const ElementContext_1 = require("./ElementContext");
/**
 * Context for /results (aka search).
 */
class SearchContext extends ElementContext_1.ElementContext {
    getElements() {
        throw new Error("Method not implemented.");
    }
}
exports.SearchContext = SearchContext;
