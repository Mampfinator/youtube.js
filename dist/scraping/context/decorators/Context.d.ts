import { Result } from "neverthrow";
import { Type } from "../../../shared/types";
export declare const CONTEXT_META_KEY: unique symbol;
export declare const CONTEXT_META_WEIGHT_KEY: unique symbol;
export declare const DEFAULT_WEIGHT = 0;
export type ContextData = {
    matcher: Matcher;
    constructor: Type<unknown>;
    weight: number;
};
type Matcher = (url: string) => boolean | Result<boolean, any>;
export declare function getContexts(): ContextData[];
/**
 * Marks this class as a `Context` for links matching the supplied `Matcher` or `RegExp`.
 * Contexts are collected by the `ContextFactory` when it's instantiated, and automatically constructed by it depending on supplied URLs (or use overrides).
 * @param regex What paths to match.
 * @param weight The higher the weight, the earlier this matcher is evaluated.
 */
export declare function Context(regex: RegExp, weight?: number): ClassDecorator;
export declare function Context(matcher: Matcher, weight?: number): ClassDecorator;
export declare function getContextInfo<T extends Function>(target: T): [Matcher, number];
export {};
