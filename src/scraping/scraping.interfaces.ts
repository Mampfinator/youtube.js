import { Result } from "neverthrow";
import { Dispatcher } from "undici";

export type FetchTransform = (body: string) => Result<any, Error>;

export type FlatResult<T, E = Error> = T extends Result<
    infer TValue,
    infer TError
>
    ? TValue extends Result<any, any>
        ? FlatResult<TValue>
        : Result<TValue, TError>
    : Result<T, E>;

export type FetchReturn<TTransform extends FetchTransform | undefined> =
    Promise<
        FlatResult<
            TTransform extends undefined
                ? string
                : ReturnType<TTransform & Function>,
            FetchError
        >
    >;

export interface FetchOptions<
    TTransform extends FetchTransform | undefined = undefined,
> extends Pick<Dispatcher.DispatchOptions, "method" | "query"> {
    url: string;
    /**
     * How many retries should be permitted.
     * @defaultValue 5
     */
    maxRetries?: number;
    /**
     *
     */
    transform?: TTransform;
    headers?: Record<string, string>;
    body?: string | Buffer | object;
}

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
}

export class FetchError<TCode extends FetchErrorCode = any> {
    constructor(
        public readonly options: FetchOptions<any>,
        public readonly code: TCode,
        public readonly errors?: Error[],
    ) {}
}

export type IRequestOrchestrator = {
    /**
     * Used for all scraping requests. If your choose to implement this yourself, **read the wiki page** about YouTube ratelimits and cookies.
     * @param options
     */
    fetch<TTransform extends FetchTransform | undefined = undefined>(
        options: FetchOptions<TTransform>,
    ): FetchReturn<TTransform>;

    /**
     * If your custom orchestrator needs to be initialized asynchronously, implement this method. The scraping client will start it alongside itself.
     */
    init?(): Promise<Result<void, Error>>;

    /**
     * If your orchestrator needs asynchronous cleanup logic, do that here.
     */
    destroy?(): Promise<void>;
};
