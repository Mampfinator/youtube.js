"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityPostContext = void 0;
const neverthrow_1 = require("neverthrow");
const community_posts_1 = require("../extractors/community-posts");
const Context_1 = require("./decorators/Context");
const ScrapingContext_1 = require("./ScrapingContext");
const channel_data_1 = require("../extractors/channel-data");
const CommentFetcher_1 = require("../CommentFetcher");
/**
 * Context for individual community posts.
 */
let CommunityPostContext = class CommunityPostContext extends ScrapingContext_1.ScrapingContext {
    getPost() {
        try {
            const renderer = this.data.ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.find((renderer) => renderer.itemSectionRenderer.sectionIdentifier ===
                "backstage-item-section").itemSectionRenderer.contents[0]
                .backstagePostThreadRenderer.post;
            return (0, neverthrow_1.ok)((0, community_posts_1.extractCommunityPost)((renderer.backstagePostRenderer ??
                renderer.sharedPostRenderer)));
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
    getChannelData() {
        try {
            return (0, neverthrow_1.ok)((0, channel_data_1.extractChannelData)(this.data.ytInitialData.microformat
                .microformatDataRenderer));
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
    comments() {
        const endpoint = this.data.ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[1].itemSectionRenderer.contents[0]?.continuationItemRenderer;
        if (!endpoint) {
            throw new Error("No comments available for this community post.");
        }
        const trackingParams = endpoint.trackingParams;
        const token = endpoint.continuationEndpoint.continuationCommand.token;
        return new CommentFetcher_1.CommentFetcher(this, trackingParams, token, "browse");
    }
};
CommunityPostContext = __decorate([
    (0, Context_1.Context)(/(?<=youtube.com\/post\/)Ug[A-Za-z0-9_\-]+|(?<=youtube.com\/channel\/.+\/community\?lb=)Ug[A-Za-z0-9_\-]/, 2 /* needs to be evaluated **before** CommunityContext */)
], CommunityPostContext);
exports.CommunityPostContext = CommunityPostContext;
