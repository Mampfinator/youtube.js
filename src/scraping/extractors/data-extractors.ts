import {
    YtInitialData,
    YtCfg,
    YtInitialPlayerResponse,
} from "../types/internal";
import { Result, ok, err } from "neverthrow";

export const initialDataRe =
    /(?<=var ytInitialData *\= *)\{.*?}(?=\;)(?<![A-z<>])/;
export const playerResponseRe =
    /(?<=var ytInitialPlayerResponse *\= *)\{.*?}(?=\;)(?<![A-z<>])/;


/**
 * Functions used for extracting data from YouTube pages.
 */
export namespace DataExtractors {
    function parse<T extends object>(
        source: string,
        regex: RegExp,
    ): Result<T, Error> {
        try {
            const match = initialDataRe.exec(source);
            if (!match || match.length == 0)
                return err(new Error(`No match found!`));
            return ok(JSON.parse(match[0]) as T);
        } catch (error) {
            return err(error as Error);
        }
    }

    /**
     * Parses ytInitialData from any YouTube page.
     * @param source the page's raw HTML string
     */
    export function ytInitialData(
        source: string,
    ): Result<YtInitialData, Error> {
        return parse<YtInitialData>(source, initialDataRe);
    }

    /**
     * **NOT IMPLEMENTED**. 
     * @param source 
     */
    export function ytCfg(source: string): Result<YtCfg, Error> {
        throw new Error("Not implemented.");
    }

    /**
     * Parses ytInitialPlayerResponse from a /watch (or youtu.be) page.
     * @param source the page's raw HTML string
     */
    export function ytInitialPlayerResponse(
        source: string,
    ): Result<YtInitialPlayerResponse, Error> {
        return parse<YtInitialPlayerResponse>(source, playerResponseRe);
    }
}
