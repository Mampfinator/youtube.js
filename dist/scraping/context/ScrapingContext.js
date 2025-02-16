"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingContext = void 0;
const neverthrow_1 = require("neverthrow");
const data_extractors_1 = require("../extractors/data-extractors");
const scraping_constants_1 = require("../scraping.constants");
/**
 * Represents a page on YouTube.
 * @template TData item this context extracts and returns.
 */
class ScrapingContext {
    data;
    body;
    url;
    orchestrator;
    constructor(options) {
        this.data = this.extract(options.body);
        this.url = options.url;
        this.orchestrator = options.orchestrator;
        Object.defineProperty(this, "body", {
            value: options.body,
            enumerable: false,
        });
    }
    /**
     * Extract data from the initial page for internal usage.
     * @param page
     * @virtual
     */
    extract(body) {
        const result = data_extractors_1.DataExtractors.ytInitialData(body);
        if (result.isErr())
            throw result.error;
        return { ytInitialData: result.value };
    }
    /**
     * Makes a browse request with the given parameters.
     * @template TReturn specifies return type.
     */
    async browse(options) {
        const { token, clickTrackingParams, visitorData, originalUrl } = options;
        const data = await this.orchestrator.fetch({
            method: "POST",
            url: options.useEndpoint ? `${scraping_constants_1.YOUTUBEI}/${options.useEndpoint}` : scraping_constants_1.BROWSE_URL,
            query: {
                key: scraping_constants_1.CLIENT_API_KEY,
            },
            headers: {
                "X-Youtube-Client-Name": "1",
                "X-Youtube-Client-Version": scraping_constants_1.YOUTUBE_CLIENT_VERSION,
                "X-Youtube-Bootstrap-Logged-In": "false",
                "X-Goog-EOM-Visitor-Id": visitorData,
                Origin: "https://youtube.com",
                Host: "www.youtube.com",
            },
            body: {
                context: {
                    client: {
                        clientName: "WEB",
                        clientVersion: scraping_constants_1.YOUTUBE_CLIENT_VERSION,
                        originalUrl: originalUrl ?? "https://youtube.com",
                        visitorData,
                    },
                    clickTracking: { clickTrackingParams },
                },
                continuation: token,
            },
            transform: (body) => {
                if (typeof body === "string")
                    return neverthrow_1.Result.fromThrowable(JSON.parse, error => error)(body);
                return (0, neverthrow_1.ok)(body);
            },
        });
        if (data.isErr())
            return (0, neverthrow_1.err)(data.error);
        return (0, neverthrow_1.ok)(data.value);
    }
    getVisitorData() {
        return this.data.ytInitialData.responseContext
            .webResponseContextExtensionData.ytConfigData.visitorData;
    }
}
exports.ScrapingContext = ScrapingContext;
