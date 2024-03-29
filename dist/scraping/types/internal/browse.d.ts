import { PurpleContinuationItemRenderer } from "./generated";
/**
 * Describes a response from /api/youtubei/browse
 */
export interface BrowseResult {
    responseContext: ResponseContext;
    trackingParams: string;
    onResponseReceivedActions?: {
        appendContinuationItemsAction: {
            continuationItems: any[];
        };
    }[];
    onResponseReceivedEndpoints?: {
        appendContinuationItemsAction: {
            continuationItems: any[];
        };
    }[];
}
export interface ResponseContext {
}
type ContinuationItemRenderer = {
    continuationItemRenderer: PurpleContinuationItemRenderer;
};
export interface OnResponseReceivedAction {
    targetId: string;
    continuationItems?: Record<string, any>[] | [...Record<string, any>[], ContinuationItemRenderer];
}
export {};
