"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeCDN = void 0;
const cdn_constants_1 = require("./cdn.constants");
class YouTubeCDN {
    getVideoThumbnail(videoId, quality) {
        return `${cdn_constants_1.CDN_BASE_URL}/vi/${videoId}/${quality}.jpg`;
    }
}
exports.YouTubeCDN = YouTubeCDN;
