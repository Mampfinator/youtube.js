"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubejsTypeError = exports.YoutubejsError = exports.makeYouTubejsError = void 0;
const ErrorCodes_1 = require("./ErrorCodes");
const Messages_1 = require("./Messages");
// inspired by Discordjs' internal errors.
function makeYouTubejsError(Base) {
    return class YoutubejsError extends Base {
        code;
        constructor(code, ...args) {
            super(getMessage(code, args));
            this.code = code;
            Error.captureStackTrace?.(this, YoutubejsError);
        }
    };
}
exports.makeYouTubejsError = makeYouTubejsError;
function getMessage(code, args) {
    if (!(code in ErrorCodes_1.YtjsErrorCode))
        throw new Error(`Error code must be a valid YoutubejsErrorCode. Received ${code}.`);
    const message = Messages_1.Messages[code];
    if (!message)
        throw new Error(`No error message associated with code ${code}.`);
    return Reflect.apply(message, {}, args);
}
/**
 * Internal error.
 */
exports.YoutubejsError = makeYouTubejsError(Error);
exports.YoutubejsTypeError = makeYouTubejsError(TypeError);
