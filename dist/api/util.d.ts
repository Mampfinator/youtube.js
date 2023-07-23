/**
 * Copies `source` and replaces any values for properties present in `mapper` with the return value of that mapping function.
 *
 * @example
 * ```ts
 * const test = {
 *  tested: false,
 *  testedAt: string, // as ISO date
 *  testName: string
 * }
 *
 * // transformed into {tested: boolean; testedAt: Date; testName: string;}
 * const parsed = mapProperties(test, { testedAt: (input) => new Date(input)})
 * ```
 */
export declare function mapProperties<TSource extends object, TMapper extends {
    [P in keyof TSource]?: (input: TSource[P]) => any;
}>(source: TSource, mapper: TMapper): {
    [P in keyof TSource]: TMapper[P] extends (...args: any[]) => any ? ReturnType<TMapper[P]> : TSource[P];
};
export declare function clearRecord<TSource extends {
    [key: string]: any | undefined;
}>(source: TSource): {
    [P in keyof TSource]: TSource[P] extends undefined ? never : TSource[P];
};
export declare function deepClearRecord<TSource extends Record<string, Record<string, any | undefined>>>(source: TSource): {
    [k: string]: {
        [x: string]: any;
    };
};
export declare const toDate: (raw: string) => Date;
export declare const toDateOpt: (raw: string | undefined) => Date | undefined;
