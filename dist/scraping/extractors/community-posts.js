"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCommunityPost = void 0;
const scraping_util_1 = require("../scraping.util");
const community_posts_1 = require("../types/external/community-posts");
// TODO: type properly; figure out where quicktype put shared posts (if it even put them anywhere)
function extractCommunityPost(rawPost) {
    // normal posts store text in `contentText`, quote posts store them in `content`.
    const { postId: id, contentText, backstageAttachment: attachment, originalPost, content: sharedPostContent, } = rawPost;
    let attachmentType;
    switch (true) {
        case originalPost?.backstagePostRenderer !== undefined:
            attachmentType = community_posts_1.AttachmentType.SharedPost;
            break;
        case !attachment:
            attachmentType = community_posts_1.AttachmentType.None;
            break;
        case attachment.backstageImageRenderer != undefined ||
            attachment.postMultiImageRenderer != undefined:
            attachmentType = community_posts_1.AttachmentType.Image;
            break;
        case attachment.pollRenderer != undefined:
            attachmentType = community_posts_1.AttachmentType.Poll;
            break;
        case attachment.videoRenderer != undefined:
            attachmentType = community_posts_1.AttachmentType.Video;
            break;
        case attachment.playlistRenderer != undefined:
            attachmentType = community_posts_1.AttachmentType.Playlist;
            break;
        case attachment.quizRenderer != undefined:
            attachmentType = community_posts_1.AttachmentType.Quiz;
            break;
        default:
            attachmentType = "INVALID";
    }
    if (attachmentType === "INVALID") {
        throw new Error(`Could not resolve attachmentType in ${JSON.stringify(attachment)}! Please open an issue with this error!`);
    }
    const content = (() => {
        const runMapper = (run) => {
            const { text, navigationEndpoint } = run;
            if (navigationEndpoint) {
                const { commandMetadata } = navigationEndpoint;
                let url;
                const { url: parsedUrl } = commandMetadata.webCommandMetadata;
                const initialUrl = new URL(commandMetadata.webCommandMetadata.url, parsedUrl.startsWith("http")
                    ? undefined
                    : "https://youtube.com/");
                // q parameter is the redirect target for /redirect links
                if (initialUrl.searchParams.has("q")) {
                    url = initialUrl.searchParams.get("q");
                    // if &q is not present, it's a YouTube-internal link.
                }
                else {
                    url = initialUrl.toString();
                }
                if (!url)
                    throw new Error(`Could not find URL in ${JSON.stringify(navigationEndpoint)}! Please open an issue with this error message!`);
                return {
                    text,
                    url,
                };
            }
            return { text };
        };
        // this is a mess.
        return (contentText?.runs?.map(runMapper) ??
            (contentText?.simpleText
                ? { text: contentText.simpleText }
                : undefined) ??
            sharedPostContent?.runs?.map(runMapper) ??
            (sharedPostContent?.simpleText
                ? { text: sharedPostContent.simpleText }
                : undefined));
    })();
    const post = {
        id,
        content,
        attachmentType,
    };
    const images = (() => {
        if (attachmentType !== community_posts_1.AttachmentType.Image)
            return;
        const images = [];
        const addToImages = (imageRenderer) => {
            images.push((0, scraping_util_1.getThumbnail)(imageRenderer.image.thumbnails));
        };
        if (attachment.backstageImageRenderer)
            addToImages(attachment.backstageImageRenderer);
        else {
            for (const { backstageImageRenderer } of attachment
                .postMultiImageRenderer.images) {
                addToImages(backstageImageRenderer);
            }
        }
        return images;
    })();
    const pollChoices = (() => {
        if (attachmentType !== community_posts_1.AttachmentType.Poll)
            return;
        const { choices: rawChoices } = attachment.pollRenderer;
        return rawChoices.map((rawChoice) => {
            const text = (0, scraping_util_1.mergeRuns)(rawChoice.text.runs);
            const choice = { text };
            if (rawChoice.image)
                choice.imageUrl = (0, scraping_util_1.getThumbnail)(rawChoice.image.thumbnails);
            return choice;
        });
    })();
    const quizChoices = (() => {
        if (attachmentType !== community_posts_1.AttachmentType.Quiz)
            return;
        const { choices } = attachment.quizRenderer;
        return choices.map(({ text, image, isCorrect, }) => {
            const choice = {
                text: (0, scraping_util_1.mergeRuns)(text.runs),
                isCorrect,
            };
            if (image)
                choice.imageUrl = (0, scraping_util_1.getThumbnail)(image.thumbnails);
            return choice;
        });
    })();
    const video = (() => {
        if (attachmentType !== community_posts_1.AttachmentType.Video)
            return;
        const { videoId: id, thumbnail: thumbnails, title: titleRaw, descriptionSnippet: descriptionSnippetRaw, badges, } = attachment.videoRenderer;
        const thumbnail = (0, scraping_util_1.getThumbnail)(thumbnails.thumbnails);
        const title = titleRaw.simpleText ?? (0, scraping_util_1.mergeRuns)(titleRaw.runs);
        const descriptionSnippet = descriptionSnippetRaw
            ? (0, scraping_util_1.mergeRuns)(descriptionSnippetRaw.runs)
            : undefined;
        const membersOnly = (badges &&
            badges.some(({ metadataBadgeRenderer }) => metadataBadgeRenderer?.style ==
                "BADGE_STYLE_TYPE_MEMBERS_ONLY")) ??
            false;
        return {
            id,
            title,
            descriptionSnippet,
            thumbnail,
            membersOnly,
        };
    })();
    const playlist = (() => {
        if (attachmentType !== community_posts_1.AttachmentType.Playlist)
            return;
        const { title: titleRenderer, thumbnailRenderer, playlistId: id, } = attachment.playlistRenderer;
        const title = titleRenderer.simpleText ?? (0, scraping_util_1.mergeRuns)(titleRenderer.text.runs);
        const thumbail = (0, scraping_util_1.getThumbnail)(thumbnailRenderer.playlistVideoThumbnailRenderer.thumbnail
            .thumbnails);
        return {
            id,
            title,
            thumbail,
        };
    })();
    if (post.attachmentType === community_posts_1.AttachmentType.Image)
        post.images = images;
    else if (post.attachmentType === community_posts_1.AttachmentType.Poll)
        post.choices = pollChoices;
    else if (post.attachmentType === community_posts_1.AttachmentType.Quiz)
        post.choices = quizChoices;
    else if (post.attachmentType === community_posts_1.AttachmentType.Video)
        post.video = video;
    else if (post.attachmentType === community_posts_1.AttachmentType.Playlist)
        post.playlist = playlist;
    else if (post.attachmentType === community_posts_1.AttachmentType.SharedPost)
        post.sharedPost = extractCommunityPost(originalPost.backstagePostRenderer);
    return post;
}
exports.extractCommunityPost = extractCommunityPost;
