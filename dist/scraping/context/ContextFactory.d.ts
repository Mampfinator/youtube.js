import { Result } from "neverthrow";
import { Type } from "../../shared/types";
import { FetchError } from "../errors/FetchError";
import { IRequestOrchestrator } from "../scraping.interfaces";
export interface ContextOptions {
    /**
     * Orchestrator the `ScrapingClient` was instantiated with.
     */
    orchestrator: IRequestOrchestrator;
    body: string;
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
    private getContext;
}
