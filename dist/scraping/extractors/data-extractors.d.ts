import { YtInitialData, YtCfg, YtInitialPlayerResponse } from "../types/internal";
import { Result } from "neverthrow";
export declare const initialDataRe: RegExp;
export declare const playerResponseRe: RegExp;
/**
 * Functions used for extracting data from YouTube pages.
 */
export declare namespace DataExtractors {
    /**
     * Parses ytInitialData from any YouTube page.
     * @param source the page's raw HTML string
     */
    function ytInitialData(source: string): Result<YtInitialData, Error>;
    /**
     * **NOT IMPLEMENTED**.
     * @param source
     */
    function ytCfg(source: string): Result<YtCfg, Error>;
    /**
     * Parses ytInitialPlayerResponse from a /watch (or youtu.be) page.
     * @param source the page's raw HTML string
     */
    function ytInitialPlayerResponse(source: string): Result<YtInitialPlayerResponse, Error>;
}
