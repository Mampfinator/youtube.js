import { AxiosError } from "axios";
import { Result } from "neverthrow";
export declare enum FetchErrorCode {
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
    InternalError = "InternalError"
}
export declare class FetchError<TCode extends FetchErrorCode = any> extends Error {
    readonly code: TCode;
    readonly options?: Record<string, any> | undefined;
    readonly errors?: Error[] | undefined;
    constructor(code: TCode, options?: Record<string, any> | undefined, errors?: Error[] | undefined);
    static fromAxiosError(error: AxiosError, fetchOptions?: Record<string, any>): Result<FetchError<any>, null>;
}
