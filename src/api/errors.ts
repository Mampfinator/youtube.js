export function isError(code: number): boolean {
    return code >= 400 && code < 600;
}


export class YouTubeAPIError extends Error {
    public readonly code: number;
    
    constructor(
        public readonly raw: APIErrorResponse
    ) {
        super(raw.error.message);
        this.code = raw.error.code;
    }
}


export class YouTubeClientError {}

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