"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeEndpoints = exports.Method = void 0;
var Method;
(function (Method) {
    Method["Get"] = "get";
    Method["Post"] = "post";
    Method["Patch"] = "patch";
})(Method = exports.Method || (exports.Method = {}));
class YouTubeEndpoints {
    client;
    basePath;
    transformers = new Map();
    constructor(client, basePath, transformers) {
        this.client = client;
        this.basePath = basePath;
        if (transformers) {
            for (const transformer of transformers) {
                this.transformers.set(transformer.for, transformer.transform);
            }
        }
    }
    transform(input) {
        return this.transformers.get(input.kind)?.(input);
    }
}
exports.YouTubeEndpoints = YouTubeEndpoints;
