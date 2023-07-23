import { Result } from "neverthrow";
import { ChannelTab } from "../../scraping";
type URLOptions = {
    host: string;
    path: string[];
    query: Record<string, string>;
};
export declare const URLBuilder: {
    channel(): ChannelBaseBuilder;
};
export type ChannelBaseBuilder = Pick<ChannelURLBuilder, "tag" | "id" | "vanityUrl">;
export type ChannelTabBuilder = Pick<ChannelURLBuilder, "tab" | "build" | "buildSafe">;
export type ChannelBuilderFinished = Pick<ChannelURLBuilder, "build" | "buildSafe">;
export declare class ChannelURLBuilder {
    private readonly _options;
    private get options();
    constructor(options?: URLOptions);
    tag(tag: string): ChannelTabBuilder;
    id(id: string): ChannelTabBuilder;
    vanityUrl(vanityUrl: string): ChannelTabBuilder;
    buildSafe(): Result<string, Error>;
    build(): string;
    tab(tab: ChannelTab): ChannelBuilderFinished;
}
export {};
