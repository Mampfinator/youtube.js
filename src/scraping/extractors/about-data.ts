import { unescape } from "querystring";

interface LinkCommandRun {
    onTap: {
        innertubeCommand: {
            clickTrackingParams: string;
            urlEndpoint: {
                url: string;
                target: string;
                nofollow: boolean;
            };
        };
    };
}

export interface AboutMetadata {
    aboutChannelViewModel: {
        description: string;
        country: string;
        canonicalChannelUrl: string;
        channelId: string;
        links: {
            channelExternalLinkViewModel: {
                title: { content: string };
                link: {
                    content: string;
                    commandRuns: LinkCommandRun[];
                };
            };
        }[];
    };
}

export function extractAboutData(metadata: AboutMetadata): AboutData {
    const {
        aboutChannelViewModel: {
            description,
            channelId,
            canonicalChannelUrl,
            links: rawLinks,
        },
    } = metadata;

    const links = rawLinks.map(link => {
        const {
            channelExternalLinkViewModel: {
                title: { content: title },
                link: {
                    commandRuns: [
                        {
                            onTap: {
                                innertubeCommand: {
                                    urlEndpoint: { url },
                                },
                            },
                        },
                    ],
                },
            },
        } = link;

        return { title, url: extractRedirectTarget(url) };
    });

    return {
        description,
        channelId,
        canonicalChannelUrl,
        links,
    };
}

function extractRedirectTarget(redirectUrl: string): string {
    const [_, url] = redirectUrl.split("&q=");

    if (!url) {
        const parsed = new URL(url);
        if (parsed.hostname === "youtube.com")
            return redirectUrl;
        throw new Error(`Invalid redirect URL: ${redirectUrl}`);
    }

    return unescape(url);
}

export interface AboutData {
    description: string;
    channelId: string;
    canonicalChannelUrl: string;
    links: { title: string; url: string }[];
}
