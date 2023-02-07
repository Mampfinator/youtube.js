interface Etag {
    etag: string; 
}

export interface Kind<T extends string = string> {
    kind: T;
}

interface ID {
    id: string;
}
/**
 * Identifies responses.
 */
export type ResourceIdentifier<T extends string = string> = Etag & Kind<T>;
/**
 * Identifies individual items, like a video or a playlist.
 */
export type ItemIdentifier<T extends string = string> = Etag & Kind<T> & ID;

interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
    nextPageToken?: string;
    prevPageToken?: string;
}
export type ListResponse<TKind extends string, TItem extends ItemIdentifier> = ResourceIdentifier<TKind> & { items: TItem[] } & PageInfo;

/**
 * 
 */
export type Override<TSource extends object, TOverride extends Partial<Record<keyof TSource, any>>> = {
    [P in keyof TSource]: TOverride[P] extends unknown | never ? TSource[P] : TOverride[P]; 
}

export declare type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
}[Keys];


export interface ITransform<TRaw, TTransformed> {
    transform(source: TRaw): TTransformed;
}


export type ItemTransformer<TInput extends Kind<TKind>, TOutput extends object, TKind extends string> = {
    for: TKind,
    transform: (input: TInput) => TOutput;
}