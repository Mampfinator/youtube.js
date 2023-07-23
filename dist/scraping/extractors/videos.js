"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStream = exports.extractShort = exports.extractVideo = void 0;
const scraping_util_1 = require("../scraping.util");
const videos_1 = require("../types/external/videos");
function extractVideo(renderer) {
    const { videoId: id, thumbnail: { thumbnails }, title: { simpleText: title, runs: titleRuns }, } = renderer;
    return {
        type: videos_1.VideoType.Video,
        id,
        title: title ?? titleRuns.map(({ text }) => text).join(""),
        thumbnail: (0, scraping_util_1.sanitizeUrl)(thumbnails[thumbnails.length - 1].url),
    };
}
exports.extractVideo = extractVideo;
function extractShort(renderer) {
    const { videoId: id, headline: { simpleText: title }, thumbnail: { thumbnails }, videoType, } = renderer;
    return {
        type: videos_1.VideoType.Short,
        id,
        title,
        thumbnail: (0, scraping_util_1.sanitizeUrl)(thumbnails[thumbnails.length - 1].url),
    };
}
exports.extractShort = extractShort;
const STATUS_LOOKUP = {
    DEFAULT: videos_1.StreamStatus.Offline,
    UPCOMING: videos_1.StreamStatus.Upcoming,
    LIVE: videos_1.StreamStatus.Live,
};
function extractStream(renderer) {
    const { videoId: id, title: { simpleText: title, runs: titleRuns }, thumbnail: { thumbnails }, thumbnailOverlays, } = renderer;
    const overlay = thumbnailOverlays.find(overlay => overlay.thumbnailOverlayTimeStatusRenderer).thumbnailOverlayTimeStatusRenderer;
    const status = STATUS_LOOKUP[overlay.style];
    if (!status)
        throw new Error(`Could not determine stream status for overlay style ${overlay.style}`);
    return {
        type: videos_1.VideoType.Stream,
        id,
        title: title ?? titleRuns.map(({ text }) => text).join(""),
        thumbnail: (0, scraping_util_1.sanitizeUrl)(thumbnails[thumbnails.length - 1].url),
        status,
    };
}
exports.extractStream = extractStream;
