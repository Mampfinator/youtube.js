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
export function mapProperties<
    TSource extends object,
    TMapper extends { [P in keyof TSource]?: (input: TSource[P]) => any },
>(
    source: TSource,
    mapper: TMapper,
): {
    [P in keyof TSource]: TMapper[P] extends (...args: any[]) => any
        ? ReturnType<TMapper[P]>
        : TSource[P];
} {
    return Object.fromEntries(
        Object.entries(source).map(([key, value]) => [
            key,
            key in mapper ? mapper[key as keyof TSource]!(value) : value,
        ]),
    ) as any;
}

export function clearRecord<TSource extends { [key: string]: any | undefined }>(
    source: TSource,
): { [P in keyof TSource]: TSource[P] extends undefined ? never : TSource[P] } {
    return Object.fromEntries(
        Object.entries(source).filter(
            ([_, value]) => typeof value !== "undefined",
        ),
    ) as any;
}

export function deepClearRecord<
    TSource extends Record<string, Record<string, any | undefined>>,
>(source: TSource) {
    return Object.fromEntries(
        Object.entries(source).map(([key, value]) => [
            key,
            typeof value === "object" ? clearRecord(value) : value,
        ]),
    );
}

export const toDate = (raw: string) => new Date(raw);
export const toDateOpt = (raw: string | undefined) =>
    typeof raw === "undefined" ? undefined : new Date(raw);
