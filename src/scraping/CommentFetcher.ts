import { ScrapingContext } from "./context";
import { YtInitialData } from "./types";

export interface Comment {
    author: {
        id: string;
        name: string;
        avatar: string;
    }
    content: string;
    highlighted: boolean;
    id: string;
}

export class CommentFetcher {
    constructor(
        private readonly originContext: ScrapingContext<{
            ytInitialData: YtInitialData,
        }>,
        private readonly trackingParams: string,
        private readonly token: string,
        private readonly endpoint: "next" | "browse",
    ) {}

    private readonly commentsCache = new Map<string, Comment>();
    private _highlighted?: string

    public get highlighted() {
        if (this._highlighted) {
            return this.commentsCache.get(this._highlighted);
        }
        return undefined;
    }

    private extractComments(response: any): Comment[] {
        const mutations = (response as any).frameworkUpdates?.entityBatchUpdate?.mutations;

        const commentContents = new Map<string, any>();
        for (const mutation of mutations) {
            // we only care about comment content mutations.
            const payload = mutation.payload.commentEntityPayload;
            if (!payload) continue;
            commentContents.set(mutation.entityKey, payload);
        }

        return (response.onResponseReceivedEndpoints!.at(-1) as any)
            .reloadContinuationItemsCommand
            .continuationItems.map((item: any) => {
                const key = item.commentThreadRenderer?.commentViewModel.commentViewModel.commentKey;
                if (!key) return;

                const comment = commentContents.get(key);
                if (!comment) return;


                const highlighted = item.commentThreadRenderer.renderingPriority === "RENDERING_PRIORITY_LINKED_COMMENT";

                const { commentId } = item.commentThreadRenderer.commentViewModel.commentViewModel;

                const { properties: { content: { content } }, author: { channelId: id, displayName: name, avatarThumbnailUrl: avatar, } } = comment;

                return {
                    author: {
                        id, name, avatar
                    },
                    content,
                    highlighted,
                    id: commentId,
                }
            }).filter(Boolean) as Comment[];
    }

    public async *fetchComments(): AsyncGenerator<Comment> {
        let { trackingParams, token } = this;
        const visitorData = this.originContext.getVisitorData();

        while (true) {
            const result = await this.originContext.browse({
                useEndpoint: this.endpoint,
                clickTrackingParams: trackingParams,
                token,
                visitorData,
            });

            if (result.isErr()) {
                throw result.error;
            }

            const response = result.value;
            const comments = this.extractComments(response);

            for (const comment of comments) {
                if (comment.highlighted) {
                    this._highlighted = comment.id;
                }

                this.commentsCache.set(comment.id, comment);

                yield comment;
            }

            const continuation = response.onResponseReceivedEndpoints?.at(-1)?.appendContinuationItemsAction?.continuationItems?.at(-1).continuationItemRenderer;

            if (!continuation) {
                break; // no more comments to fetch.
            }

            trackingParams = continuation.continuationEndpoint.clickTrackingParams;
            token = continuation.continuationEndpoint.continuationCommand.token;
        }
    }

    public async fetchHighlightedComment(): Promise<Comment | undefined> {
        await this.fetchComments().next();
        return this.highlighted;
    }
}