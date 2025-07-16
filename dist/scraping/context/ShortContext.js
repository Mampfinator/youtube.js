"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortContext = void 0;
const neverthrow_1 = require("neverthrow");
const ScrapingContext_1 = require("./ScrapingContext");
const data_extractors_1 = require("../extractors/data-extractors");
const CommentFetcher_1 = require("../CommentFetcher");
const Context_1 = require("./decorators/Context");
let ShortContext = class ShortContext extends ScrapingContext_1.ScrapingContext {
    extract(body) {
        const result = neverthrow_1.Result.combine([
            data_extractors_1.DataExtractors.ytInitialData(body),
            data_extractors_1.DataExtractors.ytInitialPlayerResponse(body),
        ]);
        if (result.isErr())
            throw result.error;
        const [ytInitialData, ytInitialPlayerResponse] = result.value;
        return { ytInitialData, ytInitialPlayerResponse };
    }
    comments() {
        const endpoint = this.data.ytInitialData.engagementPanels[0].engagementPanelSectionListRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0]?.continuationItemRenderer?.continuationEndpoint;
        if (!endpoint) {
            throw new Error("No comments available for this short.");
        }
        const trackingParams = endpoint.trackingParams;
        const token = endpoint.continuationCommand.token;
        return new CommentFetcher_1.CommentFetcher(this, trackingParams, token, "browse");
    }
};
ShortContext = __decorate([
    (0, Context_1.Context)(/youtube\.com\/shorts\//)
], ShortContext);
exports.ShortContext = ShortContext;
