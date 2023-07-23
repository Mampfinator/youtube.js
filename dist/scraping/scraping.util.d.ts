import { AxiosRequestConfig } from "axios";
import { FetchOptions } from "./scraping.interfaces";
import { BrowseResult } from "./types/internal/browse";
export declare function toAxiosConfig(input: FetchOptions<any>): AxiosRequestConfig;
/**
 * Sanitizes non-standard (YouTube) URL parameters.
 */
export declare const sanitizeUrl: (url: string, offset?: number) => string;
type Run = {
    text: string;
};
/**
 * Merges {@linkcode Run} Arrays into a single text string.
 */
export declare const mergeRuns: (runs: Run[]) => string;
export declare const isValidDate: (date: Date) => boolean;
export declare const tryParseDate: (timestamp: string) => Date | undefined;
export declare const getThumbnail: (thumbnails: {
    url: string;
}[]) => string;
/**
 * Helper method to extract continuation items from all actions/endpoints of a browse response.
 */
export declare function getContinuationItems<T extends object = any>(result: BrowseResult): T[];
export {};
