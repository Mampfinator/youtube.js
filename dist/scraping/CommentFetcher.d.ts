import { ScrapingContext } from "./context";
import { YtInitialData } from "./types";
export interface Comment {
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    content: string;
    highlighted: boolean;
    id: string;
}
export declare class CommentFetcher {
    private readonly originContext;
    private readonly trackingParams;
    private readonly token;
    private readonly endpoint;
    constructor(originContext: ScrapingContext<{
        ytInitialData: YtInitialData;
    }>, trackingParams: string, token: string, endpoint: "next" | "browse");
    private readonly commentsCache;
    private _highlighted?;
    get highlighted(): Comment | undefined;
    private extractComments;
    fetchComments(): AsyncGenerator<Comment>;
    fetchHighlightedComment(): Promise<Comment | undefined>;
}
