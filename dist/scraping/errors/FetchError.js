"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchError = exports.FetchErrorCode = void 0;
var FetchErrorCode;
(function (FetchErrorCode) {
    /**
     * Implies the host has blocked further requests.
     */
    FetchErrorCode["Blocked"] = "Blocked";
    FetchErrorCode["NotFound"] = "NotFound";
    FetchErrorCode["BadRequest"] = "BadRequest";
    /**
     * Orchestrator has not been initialized. Make sure `ScrapingClient#start` has been called.
     */
    FetchErrorCode["NotInitialized"] = "NotInitialized";
    FetchErrorCode["Unknown"] = "Unknown";
    FetchErrorCode["RetriesExceeded"] = "RetriesExceeded";
    FetchErrorCode["InvalidURL"] = "InvalidURL";
    FetchErrorCode["InternalError"] = "InternalError";
})(FetchErrorCode = exports.FetchErrorCode || (exports.FetchErrorCode = {}));
class FetchError extends Error {
    code;
    options;
    errors;
    constructor(code, options, errors) {
        super(FETCH_ERROR_MESSAGE_LOOKUP[code] ?? `Unknown error: ${code}.`);
        this.code = code;
        this.options = options;
        this.errors = errors;
    }
}
exports.FetchError = FetchError;
const FETCH_ERROR_MESSAGE_LOOKUP = {
    [FetchErrorCode.Blocked]: "Request blocked.",
    [FetchErrorCode.NotFound]: "Not found.",
    [FetchErrorCode.BadRequest]: "Bad request.",
    [FetchErrorCode.NotInitialized]: "Request orchestrator not initialized. Make sure ScrapingClient#init has been called.",
    [FetchErrorCode.Unknown]: "Unknown error.",
    [FetchErrorCode.RetriesExceeded]: "Retries exceeded.",
    [FetchErrorCode.InvalidURL]: "Invalid URL.",
    [FetchErrorCode.InternalError]: "Internal error! Check suberrors for details.",
};
