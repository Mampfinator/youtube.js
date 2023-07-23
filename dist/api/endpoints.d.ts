import { ItemTransformer, Kind } from "./base-types";
import { YouTubeClient } from "./client";
export declare enum Method {
    Get = "get",
    Post = "post",
    Patch = "patch"
}
export declare class YouTubeEndpoints {
    readonly client: YouTubeClient;
    private readonly basePath;
    private readonly transformers;
    constructor(client: YouTubeClient, basePath: string, transformers?: readonly ItemTransformer<any, any, any>[]);
    protected transform<TInput extends Kind<any>, TOutput extends object>(input: TInput): TOutput | undefined;
}
