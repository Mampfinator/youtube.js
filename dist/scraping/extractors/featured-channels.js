"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPartialFeaturedChannel = exports.extractFullFeaturedChannel = exports.extractDefaultGridSection = exports.extractShelfSection = exports.DEFAULT_CHANNEL_SECTION = void 0;
const scraping_util_1 = require("../scraping.util");
const featured_channels_1 = require("../types/external/featured-channels");
exports.DEFAULT_CHANNEL_SECTION = "DEFAULT_CHANNEL_SECTION";
/**
 * Extracts a featured channel section from a section shelf renderer.
 */
function extractShelfSection(renderer) {
    const { title: { runs } = { runs: [] }, content: { expandedShelfContentsRenderer, horizontalListRenderer }, } = renderer;
    return {
        title: (0, scraping_util_1.mergeRuns)(runs),
        channels: expandedShelfContentsRenderer
            ? expandedShelfContentsRenderer.items
                .map(({ channelRenderer }) => channelRenderer)
                .map(extractFullFeaturedChannel)
            : horizontalListRenderer.items
                .map(({ gridChannelRenderer }) => gridChannelRenderer)
                .map(extractPartialFeaturedChannel),
    };
}
exports.extractShelfSection = extractShelfSection;
/**
 *
 * @param renderers
 * @returns
 */
function extractDefaultGridSection(renderers) {
    return {
        title: exports.DEFAULT_CHANNEL_SECTION,
        channels: renderers.items
            .map(({ gridChannelRenderer }) => gridChannelRenderer)
            .filter(i => i)
            .map(extractPartialFeaturedChannel),
    };
}
exports.extractDefaultGridSection = extractDefaultGridSection;
/**
 * Extracts a single featured channel from items in a section renderer.
 */
function extractFullFeaturedChannel(renderer) {
    const { channelId: id, title: { simpleText: name }, thumbnail: { thumbnails }, descriptionSnippet, } = renderer;
    return {
        type: featured_channels_1.FeaturedChannelType.Full,
        id,
        name,
        avatar: (0, scraping_util_1.sanitizeUrl)(thumbnails[thumbnails.length - 1].url),
        descriptionSnippet: descriptionSnippet?.runs.map(({ text, url }) => ({ text, url })),
    };
}
exports.extractFullFeaturedChannel = extractFullFeaturedChannel;
function extractPartialFeaturedChannel(renderer) {
    const { channelId: id, thumbnail: { thumbnails }, title: { simpleText: name }, } = renderer;
    return {
        type: featured_channels_1.FeaturedChannelType.Partial,
        id,
        name,
        avatar: (0, scraping_util_1.sanitizeUrl)(thumbnails[thumbnails.length - 1].url),
    };
}
exports.extractPartialFeaturedChannel = extractPartialFeaturedChannel;
