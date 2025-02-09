import { Result } from "neverthrow";
import { DataExtractors } from "../extractors/data-extractors";
import { YtInitialData, YtInitialPlayerResponse } from "../types/internal";
import { Context } from "./decorators/Context";
import { ScrapingContext } from "./ScrapingContext";
import { sleep } from "../../shared/util";
import { ChatMessage } from "../ChatClient";

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