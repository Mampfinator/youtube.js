"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataExtractors = exports.playerResponseRe = exports.initialDataRe = void 0;
const neverthrow_1 = require("neverthrow");
exports.initialDataRe = /(?<=var ytInitialData *\= *)\{.*?}(?=\;)(?<![A-Za-z<>])/;
exports.playerResponseRe = /(?<=var ytInitialPlayerResponse *\= *)\{.*?}(?=\;)(?<![A-Za-z<>])/;
/**
 * Functions used for extracting data from YouTube pages.
 */
var DataExtractors;
(function (DataExtractors) {
    function parse(source, regex) {
        try {
            const match = regex.exec(source);
            if (!match || match.length == 0)
                return (0, neverthrow_1.err)(new Error(`No match found!`));
            return (0, neverthrow_1.ok)(JSON.parse(match[0]));
        }
        catch (error) {
            return (0, neverthrow_1.err)(error);
        }
    }
    /**
     * Parses ytInitialData from any YouTube page.
     * @param source the page's raw HTML string
     */
    function ytInitialData(source) {
        return parse(source, exports.initialDataRe);
    }
    DataExtractors.ytInitialData = ytInitialData;
    /**
     * **NOT IMPLEMENTED**.
     * @param source
     */
    function ytCfg(source) {
        throw new Error("Not implemented.");
    }
    DataExtractors.ytCfg = ytCfg;
    /**
     * Parses ytInitialPlayerResponse from a /watch (or youtu.be) page.
     * @param source the page's raw HTML string
     */
    function ytInitialPlayerResponse(source) {
        return parse(source, exports.playerResponseRe);
    }
    DataExtractors.ytInitialPlayerResponse = ytInitialPlayerResponse;
})(DataExtractors = exports.DataExtractors || (exports.DataExtractors = {}));
