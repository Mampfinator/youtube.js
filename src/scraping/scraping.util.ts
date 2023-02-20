import { AxiosRequestConfig } from "axios";
import { FetchOptions } from "./scraping.interfaces";


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
    return url.split("=").slice(0, offset+1).join("");
}


type Run = {
    text: string;
}
/**
 * Merges {@linkcode Run} Arrays into a single text string.
 */
export const mergeRuns = (runs: Run[]) => runs.map(r => r.text).join("");

export const isValidDate = (date: Date) => !isNaN(date.getTime());
export const tryParseDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (!isValidDate(date)) return undefined;
    return date;
}

export const getThumbnail = (thumbnails: {url: string}[]): string => sanitizeUrl((thumbnails[thumbnails.length-1]).url);