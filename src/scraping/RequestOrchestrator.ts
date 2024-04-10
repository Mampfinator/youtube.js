import axios, { AxiosError, AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { err, Ok, ok, Result } from "neverthrow";
import { CookieJar, MemoryCookieStore } from "tough-cookie";
import { YoutubejsError } from "../shared/errors/YouTubejsError";
import { Type } from "../shared/types";
import { sleep } from "../shared/util";
import { FetchError, FetchErrorCode } from "./errors/FetchError";
import { COOKIE_BUTON_SELECTOR, DEFAULT_RETRIES } from "./scraping.constants";
import {
    FetchOptions,
    FetchReturn,
    FetchTransform,
    IRequestOrchestrator,
} from "./scraping.interfaces";
import { toAxiosConfig } from "./scraping.util";

type Awaitable<T> = T | Promise<T>;

type RequestQueueItem = {
    callback: () => Promise<string>;
    transform?: (value: string) => Awaitable<Result<any, any>>;
    resolve: (value: Result<any, FetchError>) => void;
    reject: (error?: FetchError | YoutubejsError) => void;
};

type ItemMetadata = {
    retries: number;
    options: FetchOptions<any>;
    reasons: Error[];
};

/**
 * Default `RequestOrchestrator`. Good for a majority of use cases.
 */
export class RequestOrchestrator implements IRequestOrchestrator {
    private readonly queue: RequestQueueItem[] = [];
    private readonly queueMeta = new WeakMap<RequestQueueItem, ItemMetadata>();

    private initialized = false;
    private axios!: AxiosInstance;
    private interval!: NodeJS.Timeout;

    constructor() {
        Object.defineProperties(this, {
            instance: { enumerable: false },
            interval: { enumerable: false },
        });
    }

    public async init(): Promise<Result<void, Error>> {
        this.axios = wrapper(
            axios.create({ jar: new CookieJar(new MemoryCookieStore()) }),
        );

        try {
            await this.axios.get("https://youtube.com/");
            await this.axios.post(
                "https://www.youtube.com/upgrade_visitor_cookie",
                null,
                { params: { eom: 1 } },
            );
            await this.axios.post("https://consent.youtube.com/save", null, {
                params: {
                    gl: "GB",
                    m: 0,
                    pc: "yt",
                    x: 5,
                    src: 2,
                    hl: "en",
                    /**
                     * from some preliminary testing, this appears to be a constant for `Reject All`.
                     */
                    bl: 529290703,
                    set_eom: true,
                },
            });

            this.initialized = true;

            this.interval = setInterval(() => {
                this.next();
            }, 1250);

            return ok(undefined as void);
        } catch (error) {
            return err(error as Error);
        }
    }

    private async next(): Promise<void> {
        if (this.queue.length === 0) return;
        const item = this.queue.shift()!;

        try {
            const value = await item.callback().then(async value => {
                if (!item.transform) return value;

                const result = await item.transform(value);
                if (result.isOk()) return result.value;

                throw result.error; // handle in catch block
            });

            item.resolve(value instanceof Ok ? value : ok(value));
        } catch (error) {
            // if our callback throws a FetchError, we can abort and bubble it up to the caller.
            if (error instanceof FetchError) {
                return item.reject(error);
            }

            this.requeue(item, error as Error);
        }
    }

    private requeue(item: RequestQueueItem, error: Error) {
        const meta = this.queueMeta.get(item)!;
        ++meta.retries;

        if (error instanceof FetchError || error instanceof YoutubejsError) {
            return item.reject(error as any);
        }

        meta.reasons.push(error ?? new Error("unknown error"));

        if (meta.retries >= (meta.options.maxRetries ?? DEFAULT_RETRIES)) {
            return item.reject(
                new FetchError(
                    FetchErrorCode.RetriesExceeded,
                    meta.options,
                    meta.reasons,
                ),
            );
        }

        this.queue.unshift(item);
    }

    public async fetch<
        TTransform extends FetchTransform | undefined = undefined,
    >(options: FetchOptions<TTransform>): FetchReturn<TTransform> {
        if (!this.initialized)
            return err(
                new FetchError(FetchErrorCode.NotInitialized, options),
            ) as any;

        return new Promise<any>((resolve, reject) => {
            const item: RequestQueueItem = {
                resolve,
                reject,
                callback: async () => {
                    try {
                        const {data: response} = await this.axios(toAxiosConfig(options));
                        return response;

                    } catch (error) {
                        if (!(error instanceof AxiosError)) throw error

                        const fetchError = FetchError.fromAxiosError(error);

                        if (fetchError.isOk()) {
                            throw fetchError.value;
                        } else {
                            throw error;
                        }
                    }
                },
                transform: options.transform,
            };

            const meta: ItemMetadata = {
                retries: 0,
                options,
                reasons: [],
            };

            this.queueMeta.set(item, meta);
            this.queue.push(item);
        }).catch(error =>
            err(
                error instanceof FetchError
                    ? error
                    : new FetchError(FetchErrorCode.Unknown, options, [
                          error as Error,
                      ]),
            ),
        );
    }

    public async destroy(): Promise<void> {
        clearInterval(this.interval);
    }
}
