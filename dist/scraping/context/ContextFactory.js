"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextFactory = void 0;
const neverthrow_1 = require("neverthrow");
const YouTubejsError_1 = require("../../shared/errors/YouTubejsError");
const util_1 = require("../../shared/util");
const FetchError_1 = require("../errors/FetchError");
const Context_1 = require("./decorators/Context");
class ContextFactory {
    orchestrator;
    matchers;
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.matchers = (0, Context_1.getContexts)().sort(({ weight: weightA }, { weight: weightB }) => weightB - weightA);
    }
    async fromUrl(urlOrOptions, useContext) {
        if (typeof urlOrOptions == "string") {
            try {
                new URL(urlOrOptions);
            }
            catch {
                return (0, neverthrow_1.err)(new FetchError_1.FetchError(FetchError_1.FetchErrorCode.InvalidURL));
            }
        }
        let data;
        let options = {
            orchestrator: this.orchestrator,
        };
        if (typeof urlOrOptions === "string") {
            options.url = urlOrOptions;
        }
        else {
            if (!urlOrOptions.url) {
                return (0, neverthrow_1.err)(new FetchError_1.FetchError(FetchError_1.FetchErrorCode.InvalidURL));
            }
            options.url = urlOrOptions.url;
        }
        const fetchOptions = typeof urlOrOptions === "string" ? {
            url: urlOrOptions,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            }
        } : urlOrOptions;
        if (useContext) {
            const result = await this.orchestrator.fetch(fetchOptions);
            if (result.isErr())
                return (0, neverthrow_1.err)(result.error);
            const context = this.getContext(useContext, {
                ...options,
                body: result.value,
            });
            return context;
        }
        for (const { matcher, constructor } of this.matchers) {
            if (!(0, util_1.isValueOk)(matcher(fetchOptions.url)))
                continue;
            if (!data) {
                // we only fetch once we know we have at least one Context that can do anything with this URL.
                data = await this.orchestrator.fetch(fetchOptions);
                if (data.isErr())
                    return (0, neverthrow_1.err)(data.error);
                options.body = data.value;
            }
            const result = this.getContext(constructor, options);
            if (result.isErr())
                return (0, neverthrow_1.err)(result.error);
            if (!result.value)
                continue;
            return result;
        }
        return (0, neverthrow_1.err)(new FetchError_1.FetchError(FetchError_1.FetchErrorCode.InternalError, {}, [
            new YouTubejsError_1.YoutubejsError("NoContextFound", fetchOptions.url),
        ]));
    }
    getContext(constructor, options) {
        if ("from" in constructor && typeof constructor.from === "function") {
            const result = constructor.from(options);
            if (!(0, util_1.isResult)(result))
                return (0, neverthrow_1.err)(new FetchError_1.FetchError(FetchError_1.FetchErrorCode.InternalError, {}, [
                    new YouTubejsError_1.YoutubejsTypeError("ExpectedResult", result),
                ]));
            if (result.isErr())
                return (0, neverthrow_1.ok)(undefined);
            return (0, neverthrow_1.ok)(result.value);
        }
        else {
            try {
                const context = new constructor(options);
                return (0, neverthrow_1.ok)(context);
            }
            catch (error) {
                return (0, neverthrow_1.err)(new FetchError_1.FetchError(FetchError_1.FetchErrorCode.Unknown, {}, [
                    error,
                ]));
            }
        }
    }
}
exports.ContextFactory = ContextFactory;
