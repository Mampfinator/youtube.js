"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosContext = void 0;
const neverthrow_1 = require("neverthrow");
const ts_mixer_1 = require("ts-mixer");
const videos_1 = require("../../extractors/videos");
const Context_1 = require("../decorators/Context");
const ElementContext_1 = require("../ElementContext");
const ChannelTabContext_1 = require("./ChannelTabContext");
/**
 * Channel context for `/videos`.
 */
let VideosContext = class VideosContext extends (0, ts_mixer_1.Mixin)(ChannelTabContext_1.ChannelTabContext, (ElementContext_1.ElementContext)) {
    toVideos(renderers) {
        const map = new Map();
        for (const renderer of renderers) {
            const stream = (0, videos_1.extractVideo)(renderer);
            map.set(stream.id, stream);
        }
        return map;
    }
    async *getElements() {
        const data = this.getData();
        if (data.isErr() || !data.value) {
            yield (0, neverthrow_1.err)([
                data.error ?? new Error("Empty data!"),
            ]);
            return;
        }
        const renderers = data.value.richGridRenderer.contents;
        yield (0, neverthrow_1.ok)({
            elements: this.toVideos(renderers
                .map(({ richItemRenderer }) => richItemRenderer?.content.videoRenderer)
                .filter(i => i)),
        });
        const continuationRenderer = renderers[renderers.length - 1]?.continuationItemRenderer;
        if (!continuationRenderer)
            return;
        const clickTrackingParams = data.value.richGridRenderer.trackingParams;
        const visitorData = this.getVisitorData();
        let { token } = continuationRenderer.continuationEndpoint.continuationCommand;
        try {
            while (token) {
                const continuation = await this.browse({
                    token,
                    clickTrackingParams,
                    visitorData,
                });
                if (continuation.isErr())
                    return yield (0, neverthrow_1.err)([continuation.error]);
                const items = continuation.value
                    .onResponseReceivedActions.map(({ appendContinuationItemsAction }) => appendContinuationItemsAction?.continuationItems)
                    .filter(i => i)
                    .flat();
                yield (0, neverthrow_1.ok)({
                    elements: this.toVideos(items
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
            yield (0, neverthrow_1.err)([error]);
            return;
        }
    }
};
VideosContext = __decorate([
    (0, Context_1.Context)((0, ChannelTabContext_1.getChannelTabRegex)(ChannelTabContext_1.ChannelTab.Videos), Context_1.DEFAULT_WEIGHT + 1)
], VideosContext);
exports.VideosContext = VideosContext;
