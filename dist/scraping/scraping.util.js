"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContinuationItems = exports.getThumbnail = exports.tryParseDate = exports.isValidDate = exports.mergeRuns = exports.sanitizeUrl = exports.toAxiosConfig = void 0;
function toAxiosConfig(input) {
    return {
        url: input.url,
        params: input.query,
        method: input.method,
        headers: input.headers,
        data: input.body,
    };
}
exports.toAxiosConfig = toAxiosConfig;
/**
 * Sanitizes non-standard (YouTube) URL parameters.
 */
const sanitizeUrl = (url, offset = 0) => {
    return url
        .split("=")
        .slice(0, offset + 1)
        .join("");
};
exports.sanitizeUrl = sanitizeUrl;
/**
 * Merges {@linkcode Run} Arrays into a single text string.
 */
const mergeRuns = (runs) => runs.map(r => r.text).join("");
exports.mergeRuns = mergeRuns;
const isValidDate = (date) => !isNaN(date.getTime());
exports.isValidDate = isValidDate;
const tryParseDate = (timestamp) => {
    const date = new Date(timestamp);
    if (!(0, exports.isValidDate)(date))
        return undefined;
    return date;
};
exports.tryParseDate = tryParseDate;
const getThumbnail = (thumbnails) => (0, exports.sanitizeUrl)(thumbnails[thumbnails.length - 1].url);
exports.getThumbnail = getThumbnail;
/**
 * Helper method to extract continuation items from all actions/endpoints of a browse response.
 */
function getContinuationItems(result) {
    const actions = [
        ...(result.onResponseReceivedActions ?? []),
        ...(result.onResponseReceivedEndpoints ?? []),
    ];
    return actions
        .map(({ appendContinuationItemsAction }) => appendContinuationItemsAction?.continuationItems)
        .filter(i => i)
        .flat();
}
exports.getContinuationItems = getContinuationItems;
