import { AxiosError } from "axios";
import { FetchOptions } from "../scraping.interfaces";
import { Result, err, ok } from "neverthrow";

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
    Unknown = "Unknown",
    RetriesExceeded = "RetriesExceeded",
    InvalidURL = "InvalidURL",
    InternalError = "InternalError",
}

const AXIOS_ERROR_CODE_LOOKUP = {
    404: FetchErrorCode.NotFound,
    403: FetchErrorCode.Blocked,
    500: FetchErrorCode.BadRequest,
};


export class FetchError<TCode extends FetchErrorCode = any> extends Error {
    constructor(
        public readonly code: TCode,
        public readonly options?: Record<string, any>,
        public readonly errors?: Error[],
    ) {
        super(FETCH_ERROR_MESSAGE_LOOKUP[code] ?? `Unknown error: ${code}.`);
    }

    static fromAxiosError(error: AxiosError, fetchOptions?: Record<string, any>): Result<FetchError<any>, null> {
        const code = error.response?.status;
        if (!code) return err(null);
        if (!(code in AXIOS_ERROR_CODE_LOOKUP)) return err(null);
        return ok(new FetchError(AXIOS_ERROR_CODE_LOOKUP[code as keyof typeof AXIOS_ERROR_CODE_LOOKUP], fetchOptions, [error]));
    }
}

const FETCH_ERROR_MESSAGE_LOOKUP: Record<FetchErrorCode, string> = {
    [FetchErrorCode.Blocked]: "Request blocked.",
    [FetchErrorCode.NotFound]: "Not found.",
    [FetchErrorCode.BadRequest]: "Bad request.",
    [FetchErrorCode.NotInitialized]:
        "Request orchestrator not initialized. Make sure ScrapingClient#init has been called.",
    [FetchErrorCode.Unknown]: "Unknown error.",
    [FetchErrorCode.RetriesExceeded]: "Retries exceeded.",
    [FetchErrorCode.InvalidURL]: "Invalid URL.",
    [FetchErrorCode.InternalError]:
        "Internal error! Check suberrors for details.",
};
