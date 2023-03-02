import { Type } from "../types";
import { YtjsErrorCode } from "./ErrorCodes";
import { Messages } from "./Messages";

interface YoutubejsBaseError extends Error {
    code: YtjsErrorCode;
}

// inspired by Discordjs' internal errors.
export function makeYouTubejsError(Base: Type<Error>) {
    return class YoutubejsError<TCode extends YtjsErrorCode> extends Base {
        constructor(
            public readonly code: TCode,
            ...args: Parameters<(typeof Messages)[TCode]>
        ) {
            super(getMessage(code, args));
            Error.captureStackTrace?.(this, YoutubejsError);
        }
    };
}

function getMessage(code: YtjsErrorCode, args: any[]): string {
    if (!(code in YtjsErrorCode))
        throw new Error(
            `Error code must be a valid YoutubejsErrorCode. Received ${code}.`,
        );
    const message = Messages[code];
    if (!message)
        throw new Error(`No error message associated with code ${code}.`);
    return Reflect.apply(message, {}, args);
}

/**
 * Internal error.
 */
export const YoutubejsError = makeYouTubejsError(Error);
export type YoutubejsError = typeof YoutubejsError;

export const YoutubejsTypeError = makeYouTubejsError(TypeError);
export type YoutubejsTypeError = typeof YoutubejsTypeError;
