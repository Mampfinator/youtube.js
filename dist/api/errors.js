"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeClientError = exports.YouTubeAPIError = exports.isError = void 0;
function isError(code) {
    return code >= 400 && code < 600;
}
exports.isError = isError;
class YouTubeAPIError extends Error {
    raw;
    code;
    constructor(raw) {
        super(raw.error.message);
        this.raw = raw;
        this.code = raw.error.code;
    }
}
exports.YouTubeAPIError = YouTubeAPIError;
class YouTubeClientError {
}
exports.YouTubeClientError = YouTubeClientError;
