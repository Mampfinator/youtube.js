export declare function isError(code: number): boolean;
export declare class YouTubeAPIError extends Error {
    readonly raw: APIErrorResponse;
    readonly code: number;
    constructor(raw: APIErrorResponse);
}
export declare class YouTubeClientError {
}
export type YouTubeError = YouTubeAPIError | YouTubeClientError;
export interface APIErrorDetails {
    message: string;
    domain: string;
    reason: string;
    location: string;
    locationType: string;
}
export interface APIError {
    code: number;
    message: string;
    errors: APIErrorDetails[];
}
export interface APIErrorResponse {
    error: APIError;
}
