"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoPlayerContext = void 0;
const neverthrow_1 = require("neverthrow");
const data_extractors_1 = require("../extractors/data-extractors");
const Context_1 = require("./decorators/Context");
const ScrapingContext_1 = require("./ScrapingContext");
let VideoPlayerContext = class VideoPlayerContext extends ScrapingContext_1.ScrapingContext {
    extract(body) {
        const result = neverthrow_1.Result.combine([
            data_extractors_1.DataExtractors.ytInitialData(body),
            data_extractors_1.DataExtractors.ytInitialPlayerResponse(body),
        ]);
        if (result.isErr())
            throw result.error;
        const [ytInitialData, ytInitialPlayerResponse] = result.value;
        return { ytInitialData, ytInitialPlayerResponse };
    }
};
VideoPlayerContext = __decorate([
    (0, Context_1.Context)(/youtube\.com\/watch\?|youtu\.be\//)
], VideoPlayerContext);
exports.VideoPlayerContext = VideoPlayerContext;
