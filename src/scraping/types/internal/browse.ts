import { FluffyContinuationItemRenderer } from "./generated";

/**
 * Describes a response from /api/youtubei/browse
 */
export interface BrowseResult {
    responseContext: ResponseContext;
    trackingParams: string;
    onResponseReceivedActions?: OnResponseReceivedAction;
}


export interface ResponseContext {

}

type ContinuationItemRenderer = FluffyContinuationItemRenderer;


export interface OnResponseReceivedAction {
    targetId: string;
    continuationItems?: Record<string, any>[] | [...Record<string,any>[], ContinuationItemRenderer];
}