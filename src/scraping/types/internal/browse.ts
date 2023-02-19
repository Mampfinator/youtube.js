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

type ContinuationItemRenderer = {}

export interface OnResponseReceivedAction {
    targetId: string;
    continuationItems?: object[] | [...object[], ContinuationItemRenderer];
}