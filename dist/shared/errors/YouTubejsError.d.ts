import { Type } from "../types";
import { YtjsErrorCode } from "./ErrorCodes";
import { Messages } from "./Messages";
export declare function makeYouTubejsError(Base: Type<Error>): {
    new <TCode extends YtjsErrorCode>(code: TCode, ...args: Parameters<(typeof Messages)[TCode]>): {
        readonly code: TCode;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
};
/**
 * Internal error.
 */
export declare const YoutubejsError: {
    new <TCode extends YtjsErrorCode>(code: TCode, ...args: Parameters<(typeof Messages)[TCode]>): {
        readonly code: TCode;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
};
export type YoutubejsError = typeof YoutubejsError;
export declare const YoutubejsTypeError: {
    new <TCode extends YtjsErrorCode>(code: TCode, ...args: Parameters<(typeof Messages)[TCode]>): {
        readonly code: TCode;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
};
export type YoutubejsTypeError = typeof YoutubejsTypeError;
