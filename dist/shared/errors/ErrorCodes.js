"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YtjsErrorCode = void 0;
const keys = [
    "UnknownError",
    "UnknownChannelTab",
    "ExpectedResult",
    "NoContextFound",
];
exports.YtjsErrorCode = Object.fromEntries(keys.map(key => [key, key]));
