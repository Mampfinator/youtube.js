import { Result } from "neverthrow";
import { DataExtractors } from "../extractors/data-extractors";
import { YtInitialData, YtInitialPlayerResponse } from "../types/internal";
import { Context } from "./decorators/Context";
import { ScrapingContext } from "./ScrapingContext";
import { CommentFetcher } from "../CommentFetcher";

export enum ChatType {
    Top = 0,
    Live = 1,
}

@Context(/youtube\.com\/watch\?|youtu\.be\//)
export class VideoPlayerContext extends ScrapingContext<{
    ytInitialData: YtInitialData;
    ytInitialPlayerResponse: YtInitialPlayerResponse;
}> {
    protected extract(body: string) {
        const result = Result.combine([
            DataExtractors.ytInitialData(body),
            DataExtractors.ytInitialPlayerResponse(body),
        ]);

        if (result.isErr()) throw result.error;

        const [ytInitialData, ytInitialPlayerResponse] = result.value;
        return { ytInitialData, ytInitialPlayerResponse };
    }

    private continuation!: string;
    private clickTrackingParams!: string;

    public getLiveChatContinuation(chatType: ChatType = ChatType.Live): [{ coninuation: string, clickTrackingParams: string }, string] | null {
        const submenus = (this.data.ytInitialData.contents as any).twoColumnWatchNextResults.conversationBar.liveChatRenderer.header.liveChatHeaderRenderer.viewSelector.sortFilterSubMenuRenderer.subMenuItems;

        return [submenus[chatType].continuation.reloadContinuationData.continuation, this.getVisitorData()];
    }

    public getStatus(): VideoStatus {
        const videoDetails = this.data.ytInitialPlayerResponse.videoDetails;

        if (videoDetails.isLive) return VideoStatus.Live;
        if (videoDetails.isUpcoming) return VideoStatus.Upcoming;
        return VideoStatus.Offline;
    }

    public comments(): CommentFetcher {
        const contents = (this.data.ytInitialData.contents as any).twoColumnWatchNextResults.results.results.contents;
        const endpoint = contents.find((content: any) => content.itemSectionRenderer?.sectionIdentifier === "comment-item-section").itemSectionRenderer.contents[0]?.continuationItemRenderer?.continuationEndpoint;
        
        if (!endpoint) {
            throw new Error("No comments found in the video player context.");
        }

        return new CommentFetcher(
            this,
            endpoint.clickTrackingParams,
            endpoint.continuationCommand.token,
            "next",
        );
    }
}

export enum VideoStatus {
    Live = "Live",
    Upcoming = "Upcoming",
    Offline = "Offline",
}


interface LiveChatBrowseResponse {
    continuationContents: {
        liveChatContinuation: {
            continuations: [{
                invalidationContinuationData: {
                    invalidationId: {
                        objectSource: number,
                        objectId: string,
                        topic: `chat-${string}`
                        subscribeToGcmTopics: boolean,
                        protoCreationTimestampMs: string,
                    }
                },
                timeoutMs: number,
                continuation: string,
            }],
            actions?: {
                addChatItemAction: {
                    item: {
                        liveChatTextMessageRenderer: {
                            message: { runs: ChatRun[] },
                            authorName: {
                                simpleText: string
                            },
                            authorPhoto: {
                                thumbnails: {
                                    url: string,
                                    width: number,
                                    height: number,
                                }[]
                            },
                            id: string,
                            timestampUsec: string,
                            authorBadges: {
                                liveChatAuthorBadgeRenderer: {
                                    customThumbnail: {
                                        thumbnails: {
                                            url: string,
                                            width: number,
                                            height: number,
                                        }[]
                                    },
                                    tooltip: string,
                                }
                            },
                            authorExternalChannelId: string,
                        }
                    }
                }
            }[]
        }
    }
}

type ChatRun = {text: string} | { emoji: { emojiId: string, image: {
    thumbnails: {
        url: string,
        width: number,
        height: number,
    }[]
} }};