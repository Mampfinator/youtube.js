import { AxiosRequestConfig } from "axios";
import { FetchOptions } from "./scraping.interfaces";
import { BrowseResult } from "./types/internal/browse";

export function toAxiosConfig(input: FetchOptions<any>): AxiosRequestConfig {
    return {
        url: input.url,
        params: input.query,
        method: input.method,
        headers: input.headers,
        data: input.body,
    };
}

/**
 * Sanitizes non-standard (YouTube) URL parameters.
 */
export const sanitizeUrl = (url: string, offset = 0): string => {
    let sanitizedUrl = url
        .split("=")
        .slice(0, offset + 1)
        .join("");

    if (sanitizedUrl.startsWith("//")) sanitizedUrl = `https:${sanitizedUrl}`;

    return sanitizedUrl;
};

type Run = {
    text: string;
};
/**
 * Merges {@linkcode Run} Arrays into a single text string.
 */
// FIXME: *incredibly* stupid hack. Sometimes `runs` can be undefined, and still get past a type check in FeaturedContext.
// The current fix (? chaining) can cause issues elsewhere, although for now, this is fine.
export const mergeRuns = (runs: Run[]): string => {
    return runs?.map(r => r.text).join("")!;
}

export const isValidDate = (date: Date) => !isNaN(date.getTime());
export const tryParseDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (!isValidDate(date)) return undefined;
    return date;
};

export const getThumbnail = (thumbnails: { url: string }[]): string =>
    sanitizeUrl(thumbnails[thumbnails.length - 1].url);

/**
 * Helper method to extract continuation items from all actions/endpoints of a browse response.
 */
export function getContinuationItems<T extends object = any>(
    result: BrowseResult,
): T[] {
    const actions = [
        ...(result.onResponseReceivedActions ?? []),
        ...(result.onResponseReceivedEndpoints ?? []),
    ];
    return actions
        .map(
            ({ appendContinuationItemsAction }) =>
                appendContinuationItemsAction?.continuationItems!,
        )
        .filter(i => i)
        .flat();
}
