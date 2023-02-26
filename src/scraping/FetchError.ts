import { FetchOptions } from "./scraping.interfaces";

export enum FetchErrorCode {
    /**
     * Implies the host has blocked further requests.
     */
    Blocked = "Blocked",
    NotFound = "NotFound",
    BadRequest = "BadRequest",
    /**
     * Orchestrator has not been initialized. Make sure `ScrapingClient#start` has been called.
     */
    NotInitialized = "NotInitialized",
    Any = "Any",
}

export class FetchError<TCode extends FetchErrorCode = any> extends Error {
    constructor(
        public readonly options: FetchOptions<any>,
        public readonly code: TCode,
        public readonly errors?: Error[],
    ) {
        super(FETCH_ERROR_MESSAGE_LOOKUP[code] ?? `Unknown error: ${code}.`);
    }
}

const FETCH_ERROR_MESSAGE_LOOKUP = {
    [FetchErrorCode.Blocked]: "Request blocked.",
    [FetchErrorCode.NotFound]: "Not found.",
    [FetchErrorCode.BadRequest]: "Bad request.",
    [FetchErrorCode.NotInitialized]:
        "Request orchestrator not initialized. Make sure ScrapingClient#init has been called.",
    [FetchErrorCode.Any]: "Unknown error.",
};
