"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityContext = void 0;
const neverthrow_1 = require("neverthrow");
const ts_mixer_1 = require("ts-mixer");
const community_posts_1 = require("../../extractors/community-posts");
const scraping_util_1 = require("../../scraping.util");
const Context_1 = require("../decorators/Context");
const ElementContext_1 = require("../ElementContext");
const ChannelTabContext_1 = require("./ChannelTabContext");
/**
 * Channel context for `/community`.
 */
let CommunityContext = class CommunityContext extends (0, ts_mixer_1.Mixin)(ChannelTabContext_1.ChannelTabContext, (ElementContext_1.ElementContext)) {
    toCommunityPosts(renderers) {
        const map = new Map();
        for (const renderer of renderers.map(({ backstagePostRenderer, sharedPostRenderer }) => (backstagePostRenderer ?? sharedPostRenderer))) {
            const post = (0, community_posts_1.extractCommunityPost)(renderer);
            map.set(post.id, post);
        }
        return map;
    }
    async *getElements() {
        const data = this.getData();
        if (data.isErr()) {
            yield (0, neverthrow_1.err)([data.error]);
            return;
        }
        const list = data.value.sectionListRenderer.contents[0].itemSectionRenderer
            .contents;
        yield (0, neverthrow_1.ok)({
            elements: this.toCommunityPosts(list
                .map(({ backstagePostThreadRenderer }) => backstagePostThreadRenderer?.post)
                .filter(renderer => renderer)),
        });
        const last = list[list.length - 1];
        if (!last?.continuationItemRenderer)
            return;
        let trackingParams = data.value?.sectionListRenderer.trackingParams;
        let { token } = last.continuationItemRenderer.continuationEndpoint
            .continuationCommand;
        const visitorData = this.getVisitorData();
        try {
            while (token) {
                const continuation = await this.browse({
                    token,
                    clickTrackingParams: trackingParams,
                    visitorData,
                });
                if (continuation.isErr()) {
                    yield (0, neverthrow_1.err)([continuation.error]);
                    return;
                }
                const items = (0, scraping_util_1.getContinuationItems)(continuation.value);
                yield (0, neverthrow_1.ok)({
                    elements: this.toCommunityPosts(items
                        .map(({ backstagePostThreadRenderer }) => backstagePostThreadRenderer?.post)
                        .filter((item) => item?.backstagePostRenderer ??
                        item?.sharedPostRenderer)),
                });
                token =
                    items[items.length - 1]?.continuationItemRenderer
                        ?.continuationEndpoint?.continuationCommand?.token;
            }
        }
        catch (error) {
            yield (0, neverthrow_1.err)([error]);
            return;
        }
    }
};
CommunityContext = __decorate([
    (0, Context_1.Context)((0, ChannelTabContext_1.getChannelTabRegex)(ChannelTabContext_1.ChannelTab.Community), Context_1.DEFAULT_WEIGHT + 1)
], CommunityContext);
exports.CommunityContext = CommunityContext;
