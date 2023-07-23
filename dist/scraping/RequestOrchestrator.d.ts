import { Result } from "neverthrow";
import { FetchOptions, FetchReturn, FetchTransform, IRequestOrchestrator } from "./scraping.interfaces";
/**
 * Default `RequestOrchestrator`. Good for a majority of use cases.
 */
export declare class RequestOrchestrator implements IRequestOrchestrator {
    private readonly queue;
    private readonly queueMeta;
    private initialized;
    private axios;
    private interval;
    constructor();
    init(): Promise<Result<void, Error>>;
    private next;
    private requeue;
    fetch<TTransform extends FetchTransform | undefined = undefined>(options: FetchOptions<TTransform>): FetchReturn<TTransform>;
    destroy(): Promise<void>;
}
