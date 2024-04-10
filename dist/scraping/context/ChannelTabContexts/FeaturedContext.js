"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedContext = void 0;
const neverthrow_1 = require("neverthrow");
const Context_1 = require("../decorators/Context");
const ChannelTabContext_1 = require("./ChannelTabContext");
const featured_channels_1 = require("../../extractors/featured-channels");
const scraping_util_1 = require("../../scraping.util");
/**
 * Channel context for `/featured`.
 * Is returned for every channel route that does **not** match any subroute (to mimic behaviour on YouTube itself).
 */
let FeaturedContext = class FeaturedContext extends ChannelTabContext_1.ChannelTabContext {
    getFeaturedChannels() {
        const data = this.getData();
        if (data.isErr())
            return data;
        const contents = data.value?.sectionListRenderer?.contents;
        if (!contents)
            return (0, neverthrow_1.err)(new Error("Empty channel data"));
        const channelSections = contents.map(section => section.itemSectionRenderer).filter(section => section?.contents.filter(sectionItems => sectionItems.shelfRenderer?.content.horizontalListRenderer?.items.some(item => item.gridChannelRenderer)))
            .map(section => {
            const rawTitle = section.contents.find(c => c.shelfRenderer?.title)?.shelfRenderer?.title;
            if (!rawTitle) {
                return null;
            }
            // @ts-ignore
            const title = rawTitle.simpleText ?? (0, scraping_util_1.mergeRuns)(rawTitle.runs) ?? null;
            const channels = section.contents.map(sectionItems => {
                return sectionItems.shelfRenderer?.content.horizontalListRenderer?.items.map(item => item.gridChannelRenderer).filter(c => c);
            }).flat().filter(c => !!c);
            if (channels.length === 0) {
                return null;
            }
            else {
                return {
                    title: title ?? "",
                    channels: channels.map(featured_channels_1.extractPartialFeaturedChannel),
                };
            }
        }).filter(c => c !== null);
        return (0, neverthrow_1.ok)(channelSections);
    }
};
FeaturedContext = __decorate([
    (0, Context_1.Context)(ChannelTabContext_1.CHANNEL_BASE_REGEX, Context_1.DEFAULT_WEIGHT)
], FeaturedContext);
exports.FeaturedContext = FeaturedContext;
