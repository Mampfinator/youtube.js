"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const ErrorCodes_1 = require("./ErrorCodes");
exports.Messages = {
    [ErrorCodes_1.YtjsErrorCode.UnknownError]: (description) => `Unknown error! The description provided was: ${description}.`,
    [ErrorCodes_1.YtjsErrorCode.UnknownChannelTab]: (channel, tab) => `Unknown tab "${tab}" in channel ${channel}.`,
    [ErrorCodes_1.YtjsErrorCode.ExpectedResult]: (value) => `Expected Result, received ${typeof value}.`,
    [ErrorCodes_1.YtjsErrorCode.NoContextFound]: (url) => `Could not find matching context for ${url}.`,
};
