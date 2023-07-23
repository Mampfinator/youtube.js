"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutContext = void 0;
const neverthrow_1 = require("neverthrow");
const Context_1 = require("../decorators/Context");
const ChannelTabContext_1 = require("./ChannelTabContext");
const scraping_util_1 = require("../../scraping.util");
/**
 * Channel context for `/about`.
 */
let AboutContext = class AboutContext extends ChannelTabContext_1.ChannelTabContext {
    getAbout() {
        const data = this.getData();
        if (data.isErr())
            return data;
        if (!data.value)
            return (0, neverthrow_1.err)(new Error("Empty data!"));
        const baseData = this.getChannelData();
        if (baseData.isErr())
            return baseData;
        const aboutRenderer = data.value.sectionListRenderer?.contents[0].itemSectionRenderer
            .contents[0].channelAboutFullMetadataRenderer;
        if (!aboutRenderer)
            return (0, neverthrow_1.err)(new Error("About renderer not found"));
        const { primaryLinks, viewCountText: { simpleText: viewText }, } = aboutRenderer;
        return (0, neverthrow_1.ok)({
            ...baseData.value,
            primaryLinks: primaryLinks.map(({ icon: { thumbnails: [{ url: iconUrl }], }, title: { simpleText: title }, navigationEndpoint: { urlEndpoint: { url: rawUrl }, }, }) => ({
                title,
                icon: (0, scraping_util_1.sanitizeUrl)(iconUrl),
                url: decodeURIComponent(new URL(rawUrl).searchParams.get("q")),
            })),
            channelViews: Number([...viewText.matchAll(/[0-9]+/g)].map(arr => arr[0]).join("")),
        });
    }
};
AboutContext = __decorate([
    (0, Context_1.Context)((0, ChannelTabContext_1.getChannelTabRegex)(ChannelTabContext_1.ChannelTab.About), Context_1.DEFAULT_WEIGHT + 1)
], AboutContext);
exports.AboutContext = AboutContext;
