import { Result, ok, err } from "neverthrow";
import { extractChannelData } from "../../extractors/channel-data";
import { YtInitialData } from "../../types";
import { ChannelData } from "../../types/external/channel";
import {
    CommandClass,
    TabRenderer,
    TabRendererContent,
    TwoColumnBrowseResultsRenderer,
} from "../../types/internal/generated";
import { ScrapingContext } from "../ScrapingContext";

/**
 * matches
 * - `youtube.com/@handle`,
 * - `youtube.com/channel/id`,
 * - `youtube.com/c/vanityURL`
 */
export const CHANNEL_BASE_REGEX =
    /youtube\.com\/(@[A-z0-9\-]+|c\/[A-z0-9\-]+|channel\/[A-z0-9\-]+)/;

export function getChannelTabRegex(tab: string): RegExp {
    const string =
        String(CHANNEL_BASE_REGEX).replace(/^(\/)+|(\/)+$/, "") + `${tab}`;
    return new RegExp(string);
}

interface Tab<Active extends boolean = false> {
    endpoint: CommandClass;
    selected: boolean;
    content: Active extends true ? TabRendererContent : undefined;
}

export enum ChannelTab {
    Featured = "featured",
    Videos = "videos",
    Shorts = "shorts",
    Streams = "streams",
    Playlists = "playlists",
    Community = "community",
    Channels = "channels",
    About = "about",
    Search = "search",
}

const IS_CHANNEL_TAB_LOOKUP = new Set(Object.values(ChannelTab));

/**
 * Base class for all channel tabs.
 */
export abstract class ChannelTabContext<
    TExtractData extends { ytInitialData: YtInitialData } = {
        ytInitialData: YtInitialData;
    },
> extends ScrapingContext<TExtractData> {
    private _tabData?: TabData;

    protected get tabData(): Result<TabData, Error> {
        return this.getTabData();
    }

    private getTabData(): Result<TabData, Error> {
        if (this._tabData) return ok(this._tabData);

        try {
            const { tabs } =
                this.data.ytInitialData.contents
                    .twoColumnBrowseResultsRenderer!;

            const tabData = TabData.from(tabs);
            if (tabData.isErr()) return err(tabData.error);

            this._tabData = tabData.value;
            return ok(this._tabData);
        } catch (error) {
            return err(error as Error);
        }
    }

    protected getData(): Result<TabRenderer["content"], Error> {
        return this.tabData.map(data => data.getActive().content);
    }

    protected getChannelData(): Result<ChannelData, Error> {
        try {
            return ok((extractChannelData(this.data.ytInitialData.microformat!.microformatDataRenderer)));
        } catch (error) {
            return err(error as Error);
        }
    }
}

function getTabName(path: string): Result<ChannelTab, Error> {
    const tab = path
        .trim()
        .match(/(?<=\/)[a-z]+$/)?.[0]
        ?.trim() as ChannelTab;
    if (!tab) return err(new Error(`Could not extract tab name from ${path}.`));
    if (!IS_CHANNEL_TAB_LOOKUP.has(tab))
        return err(new Error(`Unknown tab ${tab} in ${path}`));

    return ok(tab);
}

class TabData<TTab extends ChannelTab = any> {
    public static from(
        rawTabs: TwoColumnBrowseResultsRenderer["tabs"],
    ): Result<TabData, Error> {
        try {
            let active: ChannelTab | undefined;
            const tabs: Partial<Record<ChannelTab, Tab>> = {};

            for (const tab of rawTabs) {
                const renderer = tab.tabRenderer ?? tab.expandableTabRenderer;
                if (!renderer) return err(new Error("No renderer in tab."));

                const endpoint = renderer.endpoint;
                if (!endpoint)
                    return err(
                        new Error("Could not extract endpoint for tab."),
                    );

                const tabName = getTabName(
                    endpoint.commandMetadata.webCommandMetadata.url,
                );
                if (tabName.isErr()) return err(tabName.error);
                if (!tabName.value) continue;

                const selected = renderer.selected ?? false;
                if (selected) active = tabName.value;

                tabs[tabName.value] = {
                    endpoint,
                    selected,
                    content: (selected
                        ? (renderer as TabRenderer).content
                        : undefined) as any,
                };
            }

            if (!active)
                return err(new Error("Failed determining active tab."));
            return ok(new TabData(tabs as Record<ChannelTab, Tab>, active));
        } catch (error) {
            return err(error as Error);
        }
    }

    protected constructor(
        private readonly tabs: Record<ChannelTab, Tab>,
        private readonly active: TTab,
    ) {}

    public getActive(): Tab<true> {
        return this.tabs[this.active] as unknown as Tab<true>;
    }
}
