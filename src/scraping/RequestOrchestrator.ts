import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { Err, err, Ok, ok, Result } from "neverthrow";
import { launch } from "puppeteer";
import { getStoreByPage } from "puppeteer-tough-cookie-store";
import { CookieJar, MemoryCookieStore } from "tough-cookie";
import { isResult, sleep } from "../shared/util";
import { COOKIE_BUTON_SELECTOR } from "./scraping.constants";
import { FetchError, FetchErrorCode, FetchOptions, FetchReturn, FetchTransform, IRequestOrchestrator } from "./scraping.interfaces";
import { toAxiosConfig } from "./scraping.util";

type Awaitable<T> = T | Promise<T>;


type RequestQueueItem = {
    callback: () => Promise<string>;
    transform?: (value: string) => Awaitable<Result<any, any>>;
    resolve: (value: Result<any, FetchError>) => void;
    reject: (reason: any) => void; 
}

type ItemMetadata = {
    retries: number;
    maxRetries: number;
    reasons: any[];
}


/**
 * Default `RequestOrchestrator`. Good for a majority of use cases.
 */
export class RequestOrchestrator implements IRequestOrchestrator {
    private readonly queue: RequestQueueItem[] = [];
    private readonly queueMeta = new WeakMap<RequestQueueItem, ItemMetadata>();

    
    private initialized = false;
    private instance!: AxiosInstance;
    private interval!: NodeJS.Timeout;

    constructor() {
        Object.defineProperties(this, {
            instance: {enumerable: false},
            interval: {enumerable: false},
        });
    }


    public async init(): Promise<Result<void, Error>> {
        try {
            const browser = await launch({
                headless: true
            });

            const page = await browser.newPage();
            const pageJar = new CookieJar(await getStoreByPage(page))

            const response = await page.goto("https://youtube.com/");
            if (response && !response.ok()) return err(new Error(`Error getting cookies: ${response.statusText()} (${response.status})`));

            let failed = 0;

            while (true) {
                await sleep(250);


                const button = await page.$(COOKIE_BUTON_SELECTOR);

                if (button) {
                    await button.click();
                    break;
                } else {
                    ++failed;

                    if (failed > 5) {
                        const cookies = await pageJar.getCookies("https://youtube.com/");
                        if (cookies.length >= 3) break; // success

                        return err(new Error("Failed getting cookies: button selector invalid."));
                    }
                }
            }


            const jar = await pageJar.clone(new MemoryCookieStore());
            
            await page.close();
            await browser.close();

            const instance = this.instance = wrapper(axios.create({
                jar,
            }));

            this.initialized = true;

            this.interval = setInterval(() => {
                this.next();
            }, 1250);

            
            return ok(undefined);

        } catch (error) {
            if (error instanceof Error) return err(error);
            return err(new Error(`Unknown error: ${String(error)}`));
        } 
    }

    private async next(): Promise<void> {
        if (this.queue.length === 0) return;
        const item = this.queue.shift()!;

        try {
            const value = await item.callback()
            .then(async value => {
                if (item.transform) {
                    const result = await item.transform(value);
                    if (result.isErr()) return this.requeue(item, result.error);
                    return result.value;
                }

                return value;
            });
            
            item.resolve(value instanceof Ok ? value : ok(value));
        } catch (error) {
            this.requeue(item, error as Error);
        }
    };

    private requeue(item: RequestQueueItem, error: Error) {
        const meta = this.queueMeta.get(item)!;
        ++meta.retries;

        meta.reasons.push(error ?? new Error("unknown error"));

        if (meta.retries >= meta.maxRetries) {
            return item.reject(meta.reasons);
        }

        this.queue.unshift(item);
    }

    public async fetch<TTransform extends FetchTransform | undefined = undefined>(options: FetchOptions<TTransform>): FetchReturn<TTransform> {
        if (!this.initialized) return err(new FetchError(options, FetchErrorCode.NotInitialized)) as any;


        return new Promise<any>((resolve, reject) => {
            const item: RequestQueueItem = {
                resolve, 
                reject,
                callback: () => this.instance(toAxiosConfig(options)).then(response => response.data),
                transform: options.transform,
            }

            const meta: ItemMetadata = {
                retries: 0, 
                maxRetries: options.maxRetries ?? 5,
                reasons: []
            };

            this.queueMeta.set(item, meta);
            this.queue.push(item);
        });
    }

    public async destroy(): Promise<void> {
        clearInterval(this.interval); 
    }
}