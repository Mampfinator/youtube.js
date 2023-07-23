"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValueOk = exports.isResult = exports.sleep = void 0;
const neverthrow_1 = require("neverthrow");
async function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}
exports.sleep = sleep;
function isResult(arg) {
    return arg instanceof neverthrow_1.Ok || arg instanceof neverthrow_1.Err;
}
exports.isResult = isResult;
/**
 * @param value value to check. If result, is unpacked first (and returns false is it has errors).
 * @param compareTo value to compare to. Defaults to `true`.
 * @returns
 */
function isValueOk(value, compareTo = true) {
    if (isResult(value)) {
        if (value.isErr())
            return false;
        value = value.value;
    }
    return value === compareTo;
}
exports.isValueOk = isValueOk;
