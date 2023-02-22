import { getThumbnail, mergeRuns } from "../scraping.util";
import {
    AttachmentType,
    CommunityPost,
    PollChoice,
} from "../types/external/community-posts";

// TODO: type properly; figure out where quicktype put shared posts (if it even put them anywhere)
export function extractCommunityPost(
    rawPost: Record<string, any>,
): CommunityPost {
    // normal posts store text in `contentText`, quote posts store them in `content`.
    const {
        postId: id,
        contentText,
        backstageAttachment: attachment,
        originalPost,
        content: sharedPostContent,
    } = rawPost;

    let attachmentType: AttachmentType | "INVALID";
    switch (true) {
        case originalPost?.backstagePostRenderer !== undefined:
            attachmentType = AttachmentType.SharedPost;
            break;
        case !attachment:
            attachmentType = AttachmentType.None;
            break;
        case attachment.backstageImageRenderer != undefined ||
            attachment.postMultiImageRenderer != undefined:
            attachmentType = AttachmentType.Image;
            break;
        case attachment.pollRenderer != undefined:
            attachmentType = AttachmentType.Poll;
            break;
        case attachment.videoRenderer != undefined:
            attachmentType = AttachmentType.Video;
            break;
        case attachment.playlistRenderer != undefined:
            attachmentType = AttachmentType.Playlist;
            break;
        default:
            attachmentType = "INVALID";
    }

    if (attachmentType === "INVALID") {
        throw new Error(
            `Could not resolve attachmentType in ${JSON.stringify(
                attachment,
            )}! Please open an issue with this error!`,
        );
    }

    const content: { text: string; url?: string }[] | undefined = (() => {
        const runMapper = (run: any) => {
            const { text, navigationEndpoint } = run;
            if (navigationEndpoint) {
                const { commandMetadata } = navigationEndpoint;

                let url: string;
                const { url: parsedUrl } =
                    commandMetadata.webCommandMetadata as { url: string };
                const initialUrl = new URL(
                    commandMetadata.webCommandMetadata.url,
                    parsedUrl.startsWith("http")
                        ? undefined
                        : "https://youtube.com/",
                );
                // q parameter is the redirect target for /redirect links
                if (initialUrl.searchParams.has("q")) {
                    url = initialUrl.searchParams.get("q")!;
                    // if &q is not present, it's a YouTube-internal link.
                } else {
                    url = initialUrl.toString();
                }

                if (!url)
                    throw new Error(
                        `Could not find URL in ${JSON.stringify(
                            navigationEndpoint,
                        )}! Please open an issue with this error message!`,
                    );

                return {
                    text,
                    url,
                };
            }

            return { text };
        };
        // this is a mess.
        return (
            contentText?.runs?.map(runMapper) ??
            (contentText?.simpleText
                ? { text: contentText.simpleText }
                : undefined) ??
            sharedPostContent?.runs?.map(runMapper) ??
            (sharedPostContent?.simpleText
                ? { text: sharedPostContent.simpleText }
                : undefined)
        );
    })();

    const post: CommunityPost & Record<string, any> = {
        id,
        content,
        attachmentType,
    } as any;

    const images = (() => {
        if (attachmentType !== AttachmentType.Image) return;
        const images: string[] = [];

        const addToImages = (imageRenderer: any) => {
            images.push(getThumbnail(imageRenderer.image.thumbnails));
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

    const choices = (() => {
        if (attachmentType !== AttachmentType.Poll) return;
        const { choices: rawChoices } = attachment.pollRenderer;

        return rawChoices.map(
            (rawChoice: {
                text: Record<string, any>;
                image: Record<string, any>;
            }): PollChoice => {
                const text = mergeRuns(rawChoice.text.runs);
                const choice: PollChoice = { text };
                if (rawChoice.image)
                    choice.imageUrl = getThumbnail(rawChoice.image.thumbnails);
                return choice;
            },
        );
    })();

    const video = (() => {
        if (attachmentType !== AttachmentType.Video) return;

        const {
            videoId: id,
            thumbnail: thumbnails,
            title: titleRaw,
            descriptionSnippet: descriptionSnippetRaw,
            badges,
        } = attachment.videoRenderer;
        const thumbnail = getThumbnail(thumbnails.thumbnails);

        const title = titleRaw.simpleText ?? mergeRuns(titleRaw.runs);
        const descriptionSnippet = descriptionSnippetRaw
            ? mergeRuns(descriptionSnippetRaw.runs)
            : undefined;

        const membersOnly: boolean =
            (badges &&
                badges.some(
                    ({ metadataBadgeRenderer }: any) =>
                        metadataBadgeRenderer?.style ==
                        "BADGE_STYLE_TYPE_MEMBERS_ONLY",
                )) ??
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
        if (attachmentType !== AttachmentType.Playlist) return;
        const {
            title: titleRenderer,
            thumbnailRenderer,
            playlistId: id,
        } = attachment.playlistRenderer;
        const title: string =
            titleRenderer.simpleText ?? mergeRuns(titleRenderer.text.runs);
        const thumbail: string = getThumbnail(
            thumbnailRenderer.playlistVideoThumbnailRenderer.thumbnail
                .thumbnails,
        );

        return {
            id,
            title,
            thumbail,
        };
    })();

    if (post.attachmentType === AttachmentType.Image) post.images = images!;
    else if (post.attachmentType === AttachmentType.Poll)
        post.choices = choices;
    else if (post.attachmentType === AttachmentType.Video) post.video = video!;
    else if (post.attachmentType === AttachmentType.Playlist)
        post.playlist = playlist!;
    else if (post.attachmentType === AttachmentType.SharedPost)
        post.sharedPost = extractCommunityPost(
            originalPost.backstagePostRenderer,
        );

    return post as unknown as CommunityPost;
}
