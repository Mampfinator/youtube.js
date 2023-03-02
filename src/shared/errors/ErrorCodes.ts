const keys = ["UnknownError", "UnknownChannelTab", "ExpectedResult", "NoContextFound"] as const;

export const YtjsErrorCode = Object.fromEntries(
    keys.map(key => [key, key]),
) as { [P in (typeof keys)[number]]: P };
export type YtjsErrorCode = (typeof keys)[number];
