import { Result } from "neverthrow";
import { Type } from "../../../shared/types";

export const MATCH_META_KEY = Symbol("Match");
export const MATCH_META_WEIGHT_KEY = Symbol("Weight");

const registered = new Set<Type<unknown>>();
const DEFAULT_WEIGHT = 0;



export type MatcherData = {matcher: Matcher, constructor: Type<unknown>, weight: number};
type Matcher = (url: string) => boolean | Result<boolean, any>;

export function getMatchers(): MatcherData[] {
    const ret: MatcherData[] = [];

    for (const constructor of registered) {
        const [matcher, weight] = getMatcher(constructor);

        ret.push({constructor, matcher, weight: weight ?? DEFAULT_WEIGHT});
    }

    return ret;
}


/**
 * 
 * @param regex What paths to match.
 * @param weight The higher the weight, the earlier this matcher is evaluated.
 */
export function Match(regex: RegExp, weight?: number): ClassDecorator;
export function Match(matcher: Matcher, weight?: number): ClassDecorator;
export function Match(matcherOrRegex: RegExp | Matcher, weight?: number): ClassDecorator {
    const matcher = matcherOrRegex instanceof RegExp ? (url: string) => matcherOrRegex.test(url) : matcherOrRegex;
    return (target) => {
        Reflect.defineMetadata(MATCH_META_KEY, matcher, target);
        Reflect.defineMetadata(MATCH_META_WEIGHT_KEY, weight ?? DEFAULT_WEIGHT, target);
        registered.add(target as unknown as Type<unknown>);
    }
}


export function getMatcher<T extends Function>(target: T): [Matcher, number] {
    return [Reflect.getMetadata(MATCH_META_KEY, target), Reflect.getMetadata(MATCH_META_WEIGHT_KEY, target)];
}