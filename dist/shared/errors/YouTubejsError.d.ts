import { Type } from "../types";
import { Messages } from "./Messages";
export declare function makeYouTubejsError(Base: Type<Error>): {
    new <TCode extends "UnknownError" | "UnknownChannelTab" | "ExpectedResult" | "NoContextFound">(code: TCode, ...args: Parameters<{
        readonly UnknownError: (description: string) => string;
        readonly UnknownChannelTab: (channel: string, tab: string) => string;
        readonly ExpectedResult: (value: any) => string;
        readonly NoContextFound: (url: string) => string;
    }[TCode]>): {
        readonly code: TCode;
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
};
/**
 * Internal error.
 */
export declare const YoutubejsError: {
    new <TCode extends "UnknownError" | "UnknownChannelTab" | "ExpectedResult" | "NoContextFound">(code: TCode, ...args: Parameters<{
        readonly UnknownError: (description: string) => string;
        readonly UnknownChannelTab: (channel: string, tab: string) => string;
        readonly ExpectedResult: (value: any) => string;
        readonly NoContextFound: (url: string) => string;
    }[TCode]>): {
        readonly code: TCode;
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
};
export type YoutubejsError = typeof YoutubejsError;
export declare const YoutubejsTypeError: {
    new <TCode extends "UnknownError" | "UnknownChannelTab" | "ExpectedResult" | "NoContextFound">(code: TCode, ...args: Parameters<{
        readonly UnknownError: (description: string) => string;
        readonly UnknownChannelTab: (channel: string, tab: string) => string;
        readonly ExpectedResult: (value: any) => string;
        readonly NoContextFound: (url: string) => string;
    }[TCode]>): {
        readonly code: TCode;
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
};
export type YoutubejsTypeError = typeof YoutubejsTypeError;
