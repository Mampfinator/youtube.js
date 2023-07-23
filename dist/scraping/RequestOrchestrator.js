"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestOrchestrator = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const neverthrow_1 = require("neverthrow");
const tough_cookie_1 = require("tough-cookie");
const YouTubejsError_1 = require("../shared/errors/YouTubejsError");
const FetchError_1 = require("./errors/FetchError");
const scraping_constants_1 = require("./scraping.constants");
const scraping_util_1 = require("./scraping.util");
/**
 * Default `RequestOrchestrator`. Good for a majority of use cases.
 */
class RequestOrchestrator {
    queue = [];
    queueMeta = new WeakMap();
    initialized = false;
    axios;
    interval;
    constructor() {
        Object.defineProperties(this, {
            instance: { enumerable: false },
            interval: { enumerable: false },
        });
    }
    async init() {
        this.axios = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({ jar: new tough_cookie_1.CookieJar(new tough_cookie_1.MemoryCookieStore()) }));
        try {
            await this.axios.get("https://youtube.com/");
            await this.axios.post("https://www.youtube.com/upgrade_visitor_cookie", null, { params: { eom: 1 } });
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
            return (0, neverthrow_1.ok)(undefined);
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
    async next() {
        if (this.queue.length === 0)
            return;
        const item = this.queue.shift();
        try {
            const value = await item.callback().then(async (value) => {
                if (!item.transform)
                    return value;
                const result = await item.transform(value);
                if (result.isOk())
                    return result.value;
                throw result.error; // handle in catch block
            });
            item.resolve(value instanceof neverthrow_1.Ok ? value : (0, neverthrow_1.ok)(value));
        }
        catch (error) {
            this.requeue(item, error);
        }
    }
    requeue(item, error) {
        const meta = this.queueMeta.get(item);
        ++meta.retries;
        if (error instanceof FetchError_1.FetchError || error instanceof YouTubejsError_1.YoutubejsError) {
            return item.reject(error);
        }
        meta.reasons.push(error ?? new Error("unknown error"));
        if (meta.retries >= (meta.options.maxRetries ?? scraping_constants_1.DEFAULT_RETRIES)) {
            return item.reject(new FetchError_1.FetchError(FetchError_1.FetchErrorCode.RetriesExceeded, meta.options, meta.reasons));
        }
        this.queue.unshift(item);
    }
    async fetch(options) {
        if (!this.initialized)
            return (0, neverthrow_1.err)(new FetchError_1.FetchError(FetchError_1.FetchErrorCode.NotInitialized, options));
        return new Promise((resolve, reject) => {
            const item = {
                resolve,
                reject,
                callback: () => this.axios((0, scraping_util_1.toAxiosConfig)(options)).then(response => response.data),
                transform: options.transform,
            };
            const meta = {
                retries: 0,
                options,
                reasons: [],
            };
            this.queueMeta.set(item, meta);
            this.queue.push(item);
        }).catch(error => (0, neverthrow_1.err)(error instanceof FetchError_1.FetchError
            ? error
            : new FetchError_1.FetchError(FetchError_1.FetchErrorCode.Unknown, options, [
                error,
            ])));
    }
    async destroy() {
        clearInterval(this.interval);
    }
}
exports.RequestOrchestrator = RequestOrchestrator;
