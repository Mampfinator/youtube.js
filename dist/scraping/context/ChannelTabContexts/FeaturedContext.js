"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedContext = void 0;
const Context_1 = require("../decorators/Context");
const ChannelTabContext_1 = require("./ChannelTabContext");
/**
 * Channel context for `/featured`.
 * Is returned for every channel route that does **not** match any subroute (to mimic behaviour on YouTube itself).
 */
let FeaturedContext = class FeaturedContext extends ChannelTabContext_1.ChannelTabContext {
};
FeaturedContext = __decorate([
    (0, Context_1.Context)(ChannelTabContext_1.CHANNEL_BASE_REGEX, Context_1.DEFAULT_WEIGHT)
], FeaturedContext);
exports.FeaturedContext = FeaturedContext;
