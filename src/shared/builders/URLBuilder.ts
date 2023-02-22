import { ok, err, Result } from "neverthrow";
import { ChannelTab } from "../../scraping/context/ChannelTabContexts/ChannelTabContext";

type URLOptions = {
    host: string;
    path: string[];
    query: Record<string, string>;
};

function fromUrlOptions(options: URLOptions): Result<string, Error> {
    const { path, query } = options;
    let { host } = options;

    if (!host) return err(new Error("Missing host."));
    if (!host.endsWith("/")) host += "/";

    let url = host;

    if (path) url += path.join("/");
    if (query) {
        const entries = Object.entries(query);
        if (entries.length > 0) {
            let [key, value] = entries.shift()!;
            url += `?${key}=${value}`;

            for ([key, value] of entries) {
                url += `&${key}=${value}`;
            }
        }
    }

    return ok(url);
}

export const URLBuilder = {
    channel(): ChannelBaseBuilder {
        return new ChannelURLBuilder();
    },
};

// ---- CHANNEL BUILDERS ---- //
export type ChannelBaseBuilder = Pick<
    ChannelURLBuilder,
    "tag" | "id" | "vanityUrl"
>;
export type ChannelTabBuilder = Pick<
    ChannelURLBuilder,
    "tab" | "build" | "buildSafe"
>;
export type ChannelBuilderFinished = Pick<
    ChannelURLBuilder,
    "build" | "buildSafe"
>;
export class ChannelURLBuilder {
    private readonly _options: URLOptions;
    private get options(): URLOptions {
        return structuredClone(this._options);
    }

    constructor(
        options: URLOptions = {
            host: "https://youtube.com/",
            path: [],
            query: {},
        },
    ) {
        this._options = options;
    }

    public tag(tag: string): ChannelTabBuilder {
        if (!tag.startsWith("@")) tag = `@${tag}`;

        const options = this.options;
        options.path.push(tag);
        return new ChannelURLBuilder(options);
    }

    public id(id: string): ChannelTabBuilder {
        const options = this.options;
        options.path.push("channel", id);
        return new ChannelURLBuilder(options);
    }

    public vanityUrl(vanityUrl: string): ChannelTabBuilder {
        const options = this.options;
        options.path.push("c", vanityUrl);
        return new ChannelURLBuilder(options);
    }

    public buildSafe(): Result<string, Error> {
        return fromUrlOptions(this.options);
    }

    public build(): string {
        const result = fromUrlOptions(this.options);
        if (result.isErr()) throw result.error;
        return result.value;
    }

    public tab(tab: ChannelTab): ChannelBuilderFinished {
        const options = this.options;
        options.path.push(tab);
        return new ChannelURLBuilder(options);
    }
}
