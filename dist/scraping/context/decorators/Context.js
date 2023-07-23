"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContextInfo = exports.Context = exports.getContexts = exports.DEFAULT_WEIGHT = exports.CONTEXT_META_WEIGHT_KEY = exports.CONTEXT_META_KEY = void 0;
exports.CONTEXT_META_KEY = Symbol("Match");
exports.CONTEXT_META_WEIGHT_KEY = Symbol("Weight");
const registered = new Set();
exports.DEFAULT_WEIGHT = 0;
function getContexts() {
    const ret = [];
    for (const constructor of registered) {
        const [matcher, weight] = getContextInfo(constructor);
        ret.push({ constructor, matcher, weight: weight ?? exports.DEFAULT_WEIGHT });
    }
    return ret;
}
exports.getContexts = getContexts;
function Context(matcherOrRegex, weight) {
    const matcher = matcherOrRegex instanceof RegExp
        ? (url) => matcherOrRegex.test(url)
        : matcherOrRegex;
    return target => {
        Reflect.defineMetadata(exports.CONTEXT_META_KEY, matcher, target);
        Reflect.defineMetadata(exports.CONTEXT_META_WEIGHT_KEY, weight ?? exports.DEFAULT_WEIGHT, target);
        registered.add(target);
    };
}
exports.Context = Context;
function getContextInfo(target) {
    return [
        Reflect.getMetadata(exports.CONTEXT_META_KEY, target),
        Reflect.getMetadata(exports.CONTEXT_META_WEIGHT_KEY, target),
    ];
}
exports.getContextInfo = getContextInfo;
