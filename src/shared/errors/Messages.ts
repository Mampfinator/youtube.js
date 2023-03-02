import { YtjsErrorCode } from "./ErrorCodes";

export const Messages = {
    [YtjsErrorCode.UnknownError]: (description: string) =>
        `Unknown error! The description provided was: ${description}.`,
    [YtjsErrorCode.UnknownChannelTab]: (channel: string, tab: string) =>
        `Unknown tab "${tab}" in channel ${channel}.`,
    [YtjsErrorCode.ExpectedResult]: (value: any) =>
        `Expected Result, received ${typeof value}.`,
    [YtjsErrorCode.NoContextFound]: (url: string) =>
        `Could not find matching context for ${url}.`,
} as const;
