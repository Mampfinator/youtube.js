import { Result } from "neverthrow";
import { Type } from "../../shared/types";
import { FetchError } from "../errors/FetchError";
import { IRequestOrchestrator } from "../scraping.interfaces";
import { YtInitialData, YtInitialPlayerResponse } from "../types";
export interface ContextOptions {
    /**
     * Orchestrator the `ScrapingClient` was instantiated with.
     */
    orchestrator: IRequestOrchestrator;
    contextFactory: ContextFactory;
    body: string | {
        ytInitialData?: YtInitialData;
        ytInitialPlayerResponse?: YtInitialPlayerResponse;
    };
    url: string;
}
export declare class ContextFactory {
    private readonly orchestrator;
    private readonly matchers;
    constructor(orchestrator: IRequestOrchestrator);
    /**
     *
     * @param url URL to fetch from. If `useContext` is not provided, attempts to automatically find a matcher.
     * @param useContext Use this context regardless of which other contexts may match the provided URL.
     */
    fromUrl<T extends object>(url: string, useContext?: Type<T>): Promise<Result<T, FetchError>>;
    /**
     * Constructs a Context from an already fetched body and a URL.
     * @param url The URL to match against to find the appropriate Context
     * @param data The already fetched body content.
     * @returns
     */
    fromBodyData<T extends Type<unknown>>(url: string, data: any): Result<InstanceType<T> | undefined, FetchError>;
    private getContext;
}
