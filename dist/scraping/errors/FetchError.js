"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchError = exports.FetchErrorCode = void 0;
const neverthrow_1 = require("neverthrow");
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
const AXIOS_ERROR_CODE_LOOKUP = {
    404: FetchErrorCode.NotFound,
    403: FetchErrorCode.Blocked,
    500: FetchErrorCode.BadRequest,
};
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
    static fromAxiosError(error, fetchOptions) {
        const code = error.response?.status;
        if (!code)
            return (0, neverthrow_1.err)(null);
        if (!(code in AXIOS_ERROR_CODE_LOOKUP))
            return (0, neverthrow_1.err)(null);
        return (0, neverthrow_1.ok)(new FetchError(AXIOS_ERROR_CODE_LOOKUP[code], fetchOptions, [error]));
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
