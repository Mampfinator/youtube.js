"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSubClient = void 0;
const websub_util_1 = require("./websub.util");
const neverthrow_1 = require("neverthrow");
const undici_1 = require("undici");
const websub_constants_1 = require("./websub.constants");
const fast_xml_parser_1 = require("fast-xml-parser");
const events_1 = __importDefault(require("events"));
class WebSubClient extends events_1.default {
    timeout;
    secret;
    callbackUrl;
    automaticRenewal;
    pending = new Map();
    /**
     * Map of renewal timers for each channel.
     * Always empty if `automaticRenewal` is false.
     */
    renewalTimers = new Map();
    /**
     * Mount as GET handler on the callback path.
     */
    verificationHandler;
    /**
     * Mount as POST handler on the callback path.
     */
    messageHandler;
    constructor(options) {
        super();
        this.timeout = options.timeout ?? 10000;
        this.secret = options.secret;
        this.callbackUrl = options.callbackUrl;
        this.automaticRenewal = options.automaticRenewal ?? true;
        this.verificationHandler = (req, res) => {
            const { "hub.topic": topic, "hub.mode": mode, "hub.challenge": challenge, "hub.lease_seconds": lease, } = req.query;
            if (!topic ||
                typeof topic !== "string" ||
                !mode ||
                typeof topic !== "string" ||
                !challenge ||
                typeof challenge !== "string") {
                this.emit("invalidMessage", req);
                return res.writeHead(400).send();
            }
            this.emit("verified", req);
            const [, channelId] = topic.split("=");
            if (!channelId)
                return res.writeHead(400);
            try {
                switch (mode) {
                    case "denied":
                        this.pending.get(`subscribe:${channelId}`)?.((0, neverthrow_1.err)(new Error("Subscription denied.")));
                        this.emit("denied", channelId);
                        break;
                    case "subscribe":
                        this.pending.get(`subscribe:${channelId}`)?.((0, neverthrow_1.ok)(undefined));
                        this.emit("subscribed", channelId);
                        if (this.automaticRenewal)
                            this.renewalTimers.set(channelId, setTimeout(() => {
                                this.subscribe(channelId);
                                // we attempt to re-lease an hour before our subscription runs out.
                                // there may be a better way of doing this.
                            }, Number(lease) * 1000 - 60 * 60 * 1000));
                        break;
                    case "unsubscribe":
                        this.pending.get(`unsubscribe:${channelId}`)?.((0, neverthrow_1.ok)(undefined));
                        // clear any active re-leasing timeouts
                        clearTimeout(this.renewalTimers.get(channelId));
                        this.emit("unsubscribed", channelId);
                        break;
                    default:
                        throw new Error(`Unknown mode "${mode}" in YouTube WebSub message for ${channelId}.`);
                }
            }
            catch (error) {
                this.emit("error", error);
            }
            res.send(challenge);
        };
        this.messageHandler = (req, res) => {
            const hubSignature = req.header("x-hub-signature");
            const link = req.header("link");
            const body = req.body;
            if (typeof body !== "string")
                throw new Error(`Expected message handler request body to be string, got ${typeof body}.`);
            const { valid, status } = (0, websub_util_1.verifyPostMessage)(body, this.secret, hubSignature, link);
            if (!valid) {
                this.emit("invalidMessage", req);
                return res.status(status).send();
            }
            const message = new fast_xml_parser_1.XMLParser({
                ignoreAttributes: false,
                attributesGroupName: websub_constants_1.XML_FEED_ATTRIBUTES,
            }).parse(body);
            this.emit("message", message);
            if ("at:deleted-entry" in message.feed) {
                const { feed: { "at:deleted-entry": entry }, } = message;
                const { "@attributes": { "@_ref": ref, "@_when": when }, "at:by": author, } = entry;
                this.emit("entryDeleted", {
                    videoId: ref.split(":")[2],
                    when: new Date(when),
                    channelId: author?.uri.split("/")[4], // URI format is https//youtube.com/channel/[id]
                });
            }
            else {
                const { feed: { entry }, } = message;
                const { "yt:channelId": channelId, author: { name: channelName }, "yt:videoId": videoId, title, published, updated, } = entry;
                const eventName = published === updated ? "entryAdded" : "entryUpdated";
                const payload = {
                    channelId,
                    channelName,
                    videoId,
                    title,
                    published: new Date(published),
                    updated: new Date(updated),
                };
                this.emit(eventName, payload);
                this.emit("feedModified", payload);
            }
            res.status(200).send();
        };
    }
    async _doSubscribe(mode, channelId) {
        try {
            const promise = new Promise((resolve, reject) => {
                this.pending.set(`${mode}:${channelId}`, resolve);
                setTimeout(() => {
                    reject(new Error(`Verification for ${channelId} timed out.`));
                }, this.timeout);
            });
            (0, undici_1.request)(websub_constants_1.EVENTSUB_HUB_URL, {
                method: "POST",
                query: {
                    "hub.mode": mode,
                    "hub.topic": `${websub_constants_1.EVENTSUB_TOPIC}?channel_id=${channelId}`,
                    "hub.verify": "async",
                    "hub.callback": this.callbackUrl,
                    "hub.secret": this.secret,
                },
            });
            return promise;
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
    /**
     * Add a listener to this emitter that is called when the corresponding event is emitted.
     */
    on(eventName, listener) {
        return super.on(eventName, listener);
    }
    async subscribe(channelId) {
        return this._doSubscribe("subscribe", channelId);
    }
    async unsubscribe(channelId) {
        return this._doSubscribe("unsubscribe", channelId);
    }
}
exports.WebSubClient = WebSubClient;
