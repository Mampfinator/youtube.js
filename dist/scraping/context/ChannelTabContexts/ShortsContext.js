"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortsContext = void 0;
const neverthrow_1 = require("neverthrow");
const ts_mixer_1 = require("ts-mixer");
const videos_1 = require("../../extractors/videos");
const scraping_util_1 = require("../../scraping.util");
const Context_1 = require("../decorators/Context");
const ElementContext_1 = require("../ElementContext");
const ChannelTabContext_1 = require("./ChannelTabContext");
/**
 * Channel context for `/shorts`.
 */
let ShortsContext = class ShortsContext extends (0, ts_mixer_1.Mixin)(ChannelTabContext_1.ChannelTabContext, (ElementContext_1.ElementContext)) {
    toShorts(renderers) {
        const map = new Map();
        for (const renderer of renderers) {
            map.set(renderer.videoId, (0, videos_1.extractShort)(renderer));
        }
        return map;
    }
    async *getElements() {
        const data = this.getData();
        if (data.isErr()) {
            yield (0, neverthrow_1.err)([data.error]);
            return;
        }
        let continuationRenderer;
        const list = data.value.richGridRenderer.contents.map(({ richItemRenderer, continuationItemRenderer }) => (richItemRenderer?.content.reelItemRenderer ??
            continuationItemRenderer));
        if (list[list.length - 1]
            .continuationEndpoint)
            continuationRenderer =
                list.pop();
        yield (0, neverthrow_1.ok)({ elements: this.toShorts(list) });
        if (typeof continuationRenderer === "undefined")
            return;
        let clickTrackingParams = data.value?.richGridRenderer?.trackingParams;
        let { token } = continuationRenderer.continuationEndpoint.continuationCommand;
        const visitorData = this.getVisitorData();
        if (!clickTrackingParams || !token || !visitorData)
            return;
        try {
            while (token) {
                const continuation = await this.browse({
                    token,
                    clickTrackingParams,
                    visitorData,
                });
                if (continuation.isErr()) {
                    yield (0, neverthrow_1.err)([continuation.error]);
                    return;
                }
                const items = (0, scraping_util_1.getContinuationItems)(continuation.value);
                yield (0, neverthrow_1.ok)({
                    elements: this.toShorts(items
                        .map(item => item.richItemRenderer?.content
                        .reelItemRenderer)
                        .filter(i => i)),
                });
                token =
                    items[items.length - 1].continuationItemRenderer
                        ?.continuationEndpoint?.continuationCommand?.token;
            }
        }
        catch (error) {
            yield (0, neverthrow_1.err)([error]);
        }
    }
};
ShortsContext = __decorate([
    (0, Context_1.Context)((0, ChannelTabContext_1.getChannelTabRegex)(ChannelTabContext_1.ChannelTab.Shorts), Context_1.DEFAULT_WEIGHT + 1)
], ShortsContext);
exports.ShortsContext = ShortsContext;
