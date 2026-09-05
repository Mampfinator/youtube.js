"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDateOpt = exports.toDate = void 0;
exports.mapProperties = mapProperties;
exports.clearRecord = clearRecord;
exports.deepClearRecord = deepClearRecord;
/**
 * Copies `source` and replaces any values for properties present in `mapper` with the return value of that mapping function.
 *
 * @example
 * ```ts
 * const test = {
 *  tested: false,
 *  testedAt: string, // as ISO date
 *  testName: string
 * }
 *
 * // transformed into {tested: boolean; testedAt: Date; testName: string;}
 * const parsed = mapProperties(test, { testedAt: (input) => new Date(input)})
 * ```
 */
function mapProperties(source, mapper) {
    return Object.fromEntries(Object.entries(source).map(([key, value]) => [
        key,
        key in mapper ? mapper[key](value) : value,
    ]));
}
function clearRecord(source) {
    return Object.fromEntries(Object.entries(source).filter(([_, value]) => typeof value !== "undefined"));
}
function deepClearRecord(source) {
    return Object.fromEntries(Object.entries(source).map(([key, value]) => [
        key,
        typeof value === "object" ? clearRecord(value) : value,
    ]));
}
const toDate = (raw) => new Date(raw);
exports.toDate = toDate;
const toDateOpt = (raw) => typeof raw === "undefined" ? undefined : new Date(raw);
exports.toDateOpt = toDateOpt;
