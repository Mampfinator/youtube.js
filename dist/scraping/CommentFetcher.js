"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentFetcher = void 0;
class CommentFetcher {
    originContext;
    trackingParams;
    token;
    endpoint;
    constructor(originContext, trackingParams, token, endpoint) {
        this.originContext = originContext;
        this.trackingParams = trackingParams;
        this.token = token;
        this.endpoint = endpoint;
    }
    commentsCache = new Map();
    _highlighted;
    get highlighted() {
        if (this._highlighted) {
            return this.commentsCache.get(this._highlighted);
        }
        return undefined;
    }
    extractComments(response) {
        const mutations = response.frameworkUpdates?.entityBatchUpdate?.mutations;
        const commentContents = new Map();
        for (const mutation of mutations) {
            // we only care about comment content mutations.
            const payload = mutation.payload.commentEntityPayload;
            if (!payload)
                continue;
            commentContents.set(mutation.entityKey, payload);
        }
        return response.onResponseReceivedEndpoints.at(-1)
            .reloadContinuationItemsCommand
            .continuationItems.map((item) => {
            const key = item.commentThreadRenderer?.commentViewModel.commentViewModel.commentKey;
            if (!key)
                return;
            const comment = commentContents.get(key);
            if (!comment)
                return;
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
            };
        }).filter(Boolean);
    }
    async *fetchComments() {
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
    async fetchHighlightedComment() {
        await this.fetchComments().next();
        return this.highlighted;
    }
}
exports.CommentFetcher = CommentFetcher;
