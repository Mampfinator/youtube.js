"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamsContext = void 0;
const neverthrow_1 = require("neverthrow");
const ts_mixer_1 = require("ts-mixer");
const videos_1 = require("../../extractors/videos");
const scraping_util_1 = require("../../scraping.util");
const Context_1 = require("../decorators/Context");
const ElementContext_1 = require("../ElementContext");
const ChannelTabContext_1 = require("./ChannelTabContext");
/**
 * Channel context for `/streams`.
 */
let StreamsContext = class StreamsContext extends (0, ts_mixer_1.Mixin)(ChannelTabContext_1.ChannelTabContext, (ElementContext_1.ElementContext)) {
    toStreams(renderers) {
        const map = new Map();
        for (const renderer of renderers) {
            const stream = (0, videos_1.extractStream)(renderer);
            map.set(stream.id, stream);
        }
        return map;
    }
    async *getElements() {
        const data = this.getData();
        if (data.isErr()) {
            yield (0, neverthrow_1.err)([data.error]);
            return;
        }
        else if (!data.value) {
            yield (0, neverthrow_1.err)([new Error("Empty data!")]);
            return;
        }
        const renderers = data.value.richGridRenderer.contents;
        yield (0, neverthrow_1.ok)({
            elements: this.toStreams(renderers
                .map(({ richItemRenderer }) => richItemRenderer?.content?.videoRenderer)
                .filter(i => i)),
        });
        const last = renderers[renderers.length - 1];
        if (!last?.continuationItemRenderer)
            return;
        const clickTrackingParams = data.value.richGridRenderer?.trackingParams;
        const visitorData = this.getVisitorData();
        let { token } = last.continuationItemRenderer.continuationEndpoint
            .continuationCommand;
        try {
            while (token) {
                const continuation = await this.browse({
                    token,
                    clickTrackingParams,
                    visitorData,
                });
                if (continuation.isErr())
                    return yield (0, neverthrow_1.err)([continuation.error]);
                const items = (0, scraping_util_1.getContinuationItems)(continuation.value);
                yield (0, neverthrow_1.ok)({
                    elements: this.toStreams(items
                        .map(item => item.richItemRenderer?.content
                        .videoRenderer)
                        .filter(i => i)),
                });
                token =
                    items[items.length - 1].continuationItemRenderer
                        ?.continuationEndpoint.continuationCommand.token;
            }
        }
        catch (error) {
            return (0, neverthrow_1.err)([error]);
        }
    }
};
StreamsContext = __decorate([
    (0, Context_1.Context)((0, ChannelTabContext_1.getChannelTabRegex)(ChannelTabContext_1.ChannelTab.Streams), Context_1.DEFAULT_WEIGHT + 1)
], StreamsContext);
exports.StreamsContext = StreamsContext;
