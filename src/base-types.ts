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
export interface ResourceIdentifier<T extends string = string> extends Etag, Kind<T> {};
/**
 * Identifies individual items, like a video or a playlist.
 */
export interface ItemIdentifier<T extends string = string> extends Etag, Kind<T>, ID {};

interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
    nextPageToken?: string;
    prevPageToken?: string;
}

export interface ListResponse<TKind extends string, TItem extends ItemIdentifier> extends ResourceIdentifier<TKind>, PageInfo {
    items: TItem[];
} 

export type Override<TSource extends object, TOverride extends Partial<Record<keyof TSource, any>>> = TOverride & Pick<TSource, Exclude<keyof TSource, keyof TOverride>>;


export declare type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
}[Keys];


export interface Thumbnail<W extends number = number, H extends number = number> {
    url: string; 
    /**
     * Width (in pixels)
     */
    width: W; 
    /**
     * Height (in pixels)
     */
    height: H;
}

export type Replace<TSource extends object, TReplace extends keyof TSource, TNew> = {
    [P in keyof TSource]: P extends TReplace ? TNew : TSource[P]; 
}

export interface ITransform<TRaw, TTransformed> {
    transform(source: TRaw): TTransformed;
}


export type ItemTransformer<TInput extends Kind<TKind>, TOutput extends object, TKind extends string> = {
    for: TKind,
    transform: (input: TInput) => TOutput;
}