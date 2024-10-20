"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAboutData = void 0;
const querystring_1 = require("querystring");
function extractAboutData(metadata) {
    const { aboutChannelViewModel: { description, channelId, canonicalChannelUrl, links: rawLinks, }, } = metadata;
    const links = rawLinks.map(link => {
        const { channelExternalLinkViewModel: { title: { content: title }, link: { commandRuns: [{ onTap: { innertubeCommand: { urlEndpoint: { url }, }, }, },], }, }, } = link;
        return { title, url: extractRedirectTarget(url) };
    });
    return {
        description,
        channelId,
        canonicalChannelUrl,
        links,
    };
}
exports.extractAboutData = extractAboutData;
function extractRedirectTarget(redirectUrl) {
    const [_, url] = redirectUrl.split("&q=");
    if (!url) {
        const parsed = new URL(redirectUrl);
        if (parsed.hostname === "youtube.com")
            return redirectUrl;
        throw new Error(`Invalid redirect URL: ${redirectUrl}`);
    }
    return (0, querystring_1.unescape)(url);
}
