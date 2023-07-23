"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractChannelData = void 0;
const scraping_util_1 = require("../scraping.util");
function extractChannelData(input) {
    const { title: name, description, tags, unlisted, urlCanonical: url, thumbnail: { thumbnails: [{ url: thumbUrl }], }, } = input;
    const id = /(?<=channel\/).+/.exec(url)[0];
    return {
        id,
        name,
        avatar: (0, scraping_util_1.sanitizeUrl)(thumbUrl),
        description,
        url,
        tags: tags ?? [],
        unlisted,
    };
}
exports.extractChannelData = extractChannelData;
