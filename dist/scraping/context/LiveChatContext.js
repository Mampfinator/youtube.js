"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveChatContext = void 0;
const data_extractors_1 = require("../extractors/data-extractors");
const Context_1 = require("./decorators/Context");
const ScrapingContext_1 = require("./ScrapingContext");
let LiveChatContext = class LiveChatContext extends ScrapingContext_1.ScrapingContext {
    live;
    setIsLive(live) {
        this.live = live;
    }
    getIsLive() {
        return this.live ?? false;
    }
    extract(body) {
        const result = data_extractors_1.DataExtractors.ytInitialData(body);
        if (result.isErr())
            throw result.error;
        return { ytInitialData: result.value };
    }
    getInitialActions() {
        return this.data.ytInitialData
            .continuationContents.liveChatContinuation
            .actions;
    }
    getInitialContinuation() {
        const continuationContainer = this.data.ytInitialData.continuationContents.liveChatContinuation.continuations[0];
        // there are *so* many different barely nuanced keys for the different containers, but they all follow the same form - so this will be fine.
        return continuationContainer[Object.keys(continuationContainer)[0]];
    }
    async getLiveChat(continuation, clickTrackingParams, visitorData, playerOffsetMs) {
        return this.browse({
            useEndpoint: `live_chat/get_live_chat${this.live ? "" : "_replay"}`,
            token: continuation,
            clickTrackingParams,
            visitorData,
            playerOffsetMs: playerOffsetMs !== undefined ? String(playerOffsetMs) : undefined,
        });
    }
};
LiveChatContext = __decorate([
    (0, Context_1.Context)(/youtube\.com\/live_chat/)
], LiveChatContext);
exports.LiveChatContext = LiveChatContext;
