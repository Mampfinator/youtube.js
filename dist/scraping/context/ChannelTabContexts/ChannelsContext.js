"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsContext = void 0;
const neverthrow_1 = require("neverthrow");
const ts_mixer_1 = require("ts-mixer");
const featured_channels_1 = require("../../extractors/featured-channels");
const Context_1 = require("../decorators/Context");
const ElementContext_1 = require("../ElementContext");
const ChannelTabContext_1 = require("./ChannelTabContext");
/**
 * Channel context for `/channels`.
 */
let ChannelsContext = class ChannelsContext extends (0, ts_mixer_1.Mixin)(ChannelTabContext_1.ChannelTabContext, (ElementContext_1.ElementContext)) {
    async *getElements() {
        const data = this.getData();
        if (data.isErr())
            return yield (0, neverthrow_1.err)([data.error]);
        if (!data.value)
            return yield (0, neverthrow_1.err)([new Error("Empty data!")]);
        const sections = data.value
            .sectionListRenderer.contents.map(({ itemSectionRenderer }) => itemSectionRenderer?.contents)
            .flat()
            .map(({ shelfRenderer, gridRenderer }) => {
            const sections = [];
            if (shelfRenderer)
                sections.push((0, featured_channels_1.extractShelfSection)(shelfRenderer));
            if (gridRenderer)
                sections.push((0, featured_channels_1.extractDefaultGridSection)(gridRenderer));
            return sections.filter(c => c !== null);
        })
            .flat()
            .filter(i => i);
        return yield (0, neverthrow_1.ok)({
            elements: new Map(sections.map(section => [section.title, section])),
        });
    }
};
ChannelsContext = __decorate([
    (0, Context_1.Context)((0, ChannelTabContext_1.getChannelTabRegex)(ChannelTabContext_1.ChannelTab.Channels), Context_1.DEFAULT_WEIGHT + 1)
], ChannelsContext);
exports.ChannelsContext = ChannelsContext;
