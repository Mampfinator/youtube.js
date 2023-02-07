import { ItemTransformer, Kind } from "./base-types";
import { YouTubeClient } from "./client";

export enum Method {
    Get = "get",
    Post = "post",
    Patch = "patch",
}

interface FetchOptions<TMethod extends Method> {
    path: string;
    method: TMethod;
    headers?: Record<string, string>;
    body?: TMethod extends "post" | "patch" ? Record<string, any> : never;
}

export class YouTubeEndpoints {
    private readonly transformers = new Map<ItemTransformer<any, any, any>["for"], ItemTransformer<any, any, any>["transform"]>();


    constructor(
        public readonly client: YouTubeClient,
        private readonly basePath: string,
        transformers?: readonly ItemTransformer<any, any, any>[]
    ) {
        if (transformers) {
            for (const transformer of transformers) {
                this.transformers.set(transformer.for, transformer.transform);
            }
        }
    }


    protected transform<TInput extends Kind<any>, TOutput extends object>(input: TInput): TOutput | undefined {
        return this.transformers.get(input.kind)?.(input);
    }
}