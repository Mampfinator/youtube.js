export type Type<T> = { new (...args: any[]): T };

// Taken from https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist#49725198
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
> &
    {
        [K in Keys]-?: Required<Pick<T, K>> &
            Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
> &
    {
        [K in Keys]-?: Required<Pick<T, K>> &
            Partial<Record<Exclude<Keys, K>, undefined>>;
    }[Keys];

export type Awaitable<T> = Promise<T> | T;

export type DeepRequired<T extends object> = {
    [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};
