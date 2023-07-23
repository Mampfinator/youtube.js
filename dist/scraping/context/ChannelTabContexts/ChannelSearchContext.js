"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelSearchContext = void 0;
const ts_mixer_1 = require("ts-mixer");
const Context_1 = require("../decorators/Context");
const ElementContext_1 = require("../ElementContext");
const ChannelTabContext_1 = require("./ChannelTabContext");
/**
 * Channel context for `/search`.
 */
let ChannelSearchContext = class ChannelSearchContext extends (0, ts_mixer_1.Mixin)(ChannelTabContext_1.ChannelTabContext, (ElementContext_1.ElementContext)) {
    async *getElements() {
        throw new Error("Method not implemented.");
    }
};
ChannelSearchContext = __decorate([
    (0, Context_1.Context)((0, ChannelTabContext_1.getChannelTabRegex)(ChannelTabContext_1.ChannelTab.Search), Context_1.DEFAULT_WEIGHT + 1)
], ChannelSearchContext);
exports.ChannelSearchContext = ChannelSearchContext;
