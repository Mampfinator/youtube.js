"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelURLBuilder = exports.URLBuilder = void 0;
const neverthrow_1 = require("neverthrow");
function fromUrlOptions(options) {
    const { path, query } = options;
    let { host } = options;
    if (!host)
        return (0, neverthrow_1.err)(new Error("Missing host."));
    if (!host.endsWith("/"))
        host += "/";
    let url = host;
    if (path)
        url += path.join("/");
    if (query) {
        const entries = Object.entries(query);
        if (entries.length > 0) {
            let [key, value] = entries.shift();
            url += `?${key}=${value}`;
            for ([key, value] of entries) {
                url += `&${key}=${value}`;
            }
        }
    }
    return (0, neverthrow_1.ok)(url);
}
exports.URLBuilder = {
    channel() {
        return new ChannelURLBuilder();
    },
};
class ChannelURLBuilder {
    _options;
    get options() {
        return structuredClone(this._options);
    }
    constructor(options = {
        host: "https://youtube.com/",
        path: [],
        query: {},
    }) {
        this._options = options;
    }
    tag(tag) {
        if (!tag.startsWith("@"))
            tag = `@${tag}`;
        const options = this.options;
        options.path.push(tag);
        return new ChannelURLBuilder(options);
    }
    id(id) {
        const options = this.options;
        options.path.push("channel", id);
        return new ChannelURLBuilder(options);
    }
    vanityUrl(vanityUrl) {
        const options = this.options;
        options.path.push("c", vanityUrl);
        return new ChannelURLBuilder(options);
    }
    buildSafe() {
        return fromUrlOptions(this.options);
    }
    build() {
        const result = fromUrlOptions(this.options);
        if (result.isErr())
            throw result.error;
        return result.value;
    }
    tab(tab) {
        const options = this.options;
        options.path.push(tab);
        return new ChannelURLBuilder(options);
    }
}
exports.ChannelURLBuilder = ChannelURLBuilder;
