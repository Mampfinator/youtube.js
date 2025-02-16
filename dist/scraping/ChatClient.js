"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = exports.Author = exports.MessageContent = exports.ChatClient = void 0;
const util_1 = require("../shared/util");
const context_1 = require("./context");
class ChatClient {
    scraper;
    context;
    streamId;
    visitorData;
    constructor(scraper, context, streamId, visitorData) {
        this.scraper = scraper;
        this.context = context;
        this.streamId = streamId;
        this.visitorData = visitorData;
    }
    /**
     * Attempt to instantiate a `ChatClient` from a stream ID. If the video is not a current or past live stream, or no video with the given ID exists,
     * an error will be thrown.
     */
    static async fromStreamId(scraper, streamId) {
        const videoContext = await scraper.contexts.fromUrl(`https://youtube.com/watch?v=${streamId}`, context_1.VideoPlayerContext);
        if (videoContext.isErr())
            throw videoContext.error;
        const [initialContinuation, visitorData] = videoContext.value.getLiveChatContinuation();
        if (initialContinuation === null) {
            throw new Error("Live chat not available");
        }
        const isLive = videoContext.value.getStatus() === context_1.VideoStatus.Live;
        const liveChatContext = await scraper.contexts.fromUrl(`https://youtube.com/live_chat${isLive ? "" : "_replay"}?continuation=${initialContinuation}`, context_1.LiveChatContext);
        if (liveChatContext.isErr())
            throw liveChatContext.error;
        liveChatContext.value.setIsLive(isLive);
        return new ChatClient(scraper, liveChatContext.value, streamId, visitorData);
    }
    async *readRaw() {
        for (const action of this.context.getInitialActions()) {
            yield action;
        }
        let { clickTrackingParams, continuation, timeoutMs, } = this.context.getInitialContinuation();
        let playerOffsetMs = 0;
        while (true) {
            await (0, util_1.sleep)(timeoutMs);
            playerOffsetMs += timeoutMs;
            const result = await this.context.getLiveChat(continuation, clickTrackingParams, this.visitorData, this.context.getIsLive() ? playerOffsetMs : undefined);
            if (result.isErr())
                throw result.error;
            const { liveChatContinuation } = result.value.continuationContents;
            // no continuation = stream has ended
            if (!liveChatContinuation)
                return;
            const actions = liveChatContinuation.actions;
            if (!actions)
                continue;
            for (const action of actions) {
                yield action;
            }
            const continuationContainer = result.value.continuationContents.liveChatContinuation.continuations[0];
            const { clickTrackingParams: nextClickTrackingParams, continuation: nextContinuation, timeoutMs: nextTimeoutMs } = continuationContainer[Object.keys(continuationContainer)[0]];
            clickTrackingParams = nextClickTrackingParams;
            continuation = nextContinuation;
            timeoutMs = nextTimeoutMs;
        }
    }
    async *read() {
        for await (const rawMessage of this.readRaw()) {
            const converted = this.convertAction(rawMessage);
            if (converted)
                yield converted;
        }
    }
    convertAction(action) {
        if (action.replayChatItemAction) {
            action = action.replayChatItemAction.actions[0];
        }
        if (!action.addChatItemAction && !action.chatReplayItemAction)
            return undefined;
        const item = action.addChatItemAction?.item;
        const actionType = Object.keys(item)[0];
        // TODO: find and convert sticker renderers
        if (actionType === "liveChatMembershipItemRenderer") {
            const { id, timestampUsec, authorExternalChannelId, message, authorName: { simpleText: authorName }, authorPhoto, } = item[actionType];
            return {
                type: MessageType.Membership,
                timestamp: Number(timestampUsec),
                id,
                author: new Author(authorName, authorExternalChannelId, authorPhoto.thumbnails),
                message: message ? new MessageContent(message.runs) : undefined,
            };
        }
        else if (actionType === "liveChatPaidMessageRenderer") {
            const { id, timestampUsec, authorName: { simpleText: authorName }, authorPhoto, authorExternalChannelId, purchaseAmountText: { simpleText: amountText }, message, bodyBackgroundColor, bodyTextColor, authorNameTextColor, } = item[actionType];
            const amount = Number(amountText.match(/\d+/)[0]);
            const currency = amountText.match(/[^\d]+/)[0].trim();
            return {
                type: MessageType.SuperChat,
                id,
                timestamp: Number(timestampUsec),
                author: new Author(authorName, authorExternalChannelId, authorPhoto.thumbnails),
                amount, currency,
                message: message ? new MessageContent(message.runs) : undefined,
                backgroundColor: bodyBackgroundColor,
                textColor: bodyTextColor,
                authorColor: authorNameTextColor,
            };
        }
        else if (actionType === "liveChatPaidStickerRenderer") {
            const { id, timestampUsec, authorName: { simpleText: authorName }, authorPhoto, authorExternalChannelId, sticker, backgroundColor, } = item[actionType];
            return {
                type: MessageType.SuperSticker,
                id,
                timestamp: Number(timestampUsec),
                author: new Author(authorName, authorExternalChannelId, authorPhoto.thumbnails),
                sticker: sticker.thumbnails.at(-1).url,
                backgroundColor,
            };
        }
    }
}
exports.ChatClient = ChatClient;
class MessageContent {
    runs;
    constructor(runs) {
        this.runs = runs;
    }
    get simpleText() {
        return this.runs.map(run => {
            if ("emoji" in run) {
                return `:${run.emoji.shortcuts[0]}:`;
            }
            else if ("url" in run) {
                return `[${run.text}](${run.url})`;
            }
            else {
                return run.text;
            }
        }).join(" ");
    }
    get html() {
        return this.runs.map(run => {
            if ("emoji" in run) {
                const image = run.emoji.image.thumbnails.at(-1);
                return `<img alt="${run.text}" src=${image.url}></img>`;
            }
            else if ("url" in run) {
                return `<a href="${run.url}">${run.text}</a>`;
            }
            else {
                return `<span>${run.text}</span>`;
            }
        }).join("");
    }
}
exports.MessageContent = MessageContent;
// TODO: badges
class Author {
    name;
    channelId;
    avatarUrl;
    constructor(name, channelId, avatar) {
        this.name = name;
        this.channelId = channelId;
        if (typeof avatar === "string") {
            this.avatarUrl = avatar;
        }
        else {
            this.avatarUrl = avatar.at(-1).url;
        }
    }
    get channelUrl() {
        return `https://www.youtube.com/channel/${this.channelId}`;
    }
}
exports.Author = Author;
var MessageType;
(function (MessageType) {
    MessageType["SuperChat"] = "SuperChat";
    MessageType["SuperSticker"] = "SuperSticker";
    MessageType["Membership"] = "Membership";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
