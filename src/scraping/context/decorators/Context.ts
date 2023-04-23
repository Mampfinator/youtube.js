import { Result } from "neverthrow";
import { Type } from "../../../shared/types";

export const CONTEXT_META_KEY = Symbol("Match");
export const CONTEXT_META_WEIGHT_KEY = Symbol("Weight");

const registered = new Set<Type<unknown>>();
export const DEFAULT_WEIGHT = 0;

export type ContextData = {
    matcher: Matcher;
    constructor: Type<unknown>;
    weight: number;
};
type Matcher = (url: string) => boolean | Result<boolean, any>;

export function getContexts(): ContextData[] {
    const ret: ContextData[] = [];

    for (const constructor of registered) {
        const [matcher, weight] = getContextInfo(constructor);

        ret.push({ constructor, matcher, weight: weight ?? DEFAULT_WEIGHT });
    }

    return ret;
}

/**
 * Marks this class as a `Context` for links matching the supplied `Matcher` or `RegExp`. 
 * Contexts are collected by the `ContextFactory` when it's instantiated, and automatically constructed by it depending on supplied URLs (or use overrides).
 * @param regex What paths to match.
 * @param weight The higher the weight, the earlier this matcher is evaluated.
 */
export function Context(regex: RegExp, weight?: number): ClassDecorator;
export function Context(matcher: Matcher, weight?: number): ClassDecorator;
export function Context(
    matcherOrRegex: RegExp | Matcher,
    weight?: number,
): ClassDecorator {
    const matcher =
        matcherOrRegex instanceof RegExp
            ? (url: string) => matcherOrRegex.test(url)
            : matcherOrRegex;
    return target => {
        Reflect.defineMetadata(CONTEXT_META_KEY, matcher, target);
        Reflect.defineMetadata(
            CONTEXT_META_WEIGHT_KEY,
            weight ?? DEFAULT_WEIGHT,
            target,
        );
        registered.add(target as unknown as Type<unknown>);
    };
}

export function getContextInfo<T extends Function>(
    target: T,
): [Matcher, number] {
    return [
        Reflect.getMetadata(CONTEXT_META_KEY, target),
        Reflect.getMetadata(CONTEXT_META_WEIGHT_KEY, target),
    ];
}
