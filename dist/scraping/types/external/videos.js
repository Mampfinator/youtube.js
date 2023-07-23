"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamStatus = exports.VideoType = void 0;
var VideoType;
(function (VideoType) {
    VideoType["Video"] = "Video";
    VideoType["Short"] = "Short";
    VideoType["Stream"] = "Stream";
})(VideoType = exports.VideoType || (exports.VideoType = {}));
var StreamStatus;
(function (StreamStatus) {
    StreamStatus["Offline"] = "Offline";
    StreamStatus["Live"] = "Live";
    StreamStatus["Upcoming"] = "Upcoming";
})(StreamStatus = exports.StreamStatus || (exports.StreamStatus = {}));
