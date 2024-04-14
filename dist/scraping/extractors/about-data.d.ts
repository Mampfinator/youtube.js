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
                title: {
                    content: string;
                };
                link: {
                    content: string;
                    commandRuns: LinkCommandRun[];
                };
            };
        }[];
    };
}
export declare function extractAboutData(metadata: AboutMetadata): AboutData;
export interface AboutData {
    description: string;
    channelId: string;
    canonicalChannelUrl: string;
    links: {
        title: string;
        url: string;
    }[];
}
export {};
