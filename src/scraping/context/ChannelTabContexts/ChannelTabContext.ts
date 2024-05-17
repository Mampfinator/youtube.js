import { Result, ok, err } from "neverthrow";
import { YtjsErrorCode } from "../../../shared/errors/ErrorCodes";
import { YoutubejsError } from "../../../shared/errors/YouTubejsError";
import { extractChannelData } from "../../extractors/channel-data";
import { YtInitialData } from "../../types";
import { ChannelData } from "../../types/external/channel";
import {
    MoreEndpoint,
    TabRenderer,
    TabRendererContent,
    TwoColumnBrowseResultsRenderer,
} from "../../types/internal/generated";
import { ScrapingContext } from "../ScrapingContext";
import { extractAboutData } from "../../extractors/about-data";

/**
 * matches
 * - `youtube.com/@handle`,
 * - `youtube.com/channel/id`,
 * - `youtube.com/c/vanityURL`
 */
export const CHANNEL_BASE_REGEX =
    /youtube\.com\/(@[A-Za-z0-9_\-]+|c\/[A-Za-z0-9_\-]+|channel\/[A-Za-z0-9_\-]+)/;

export function getChannelTabRegex(tab: string): RegExp {
    const string =
        String(CHANNEL_BASE_REGEX).replace(/^(\/)+|(\/)+$/, "") + `${tab}`;
    return new RegExp(string);
}

interface Tab<Active extends boolean = false> {
    endpoint: MoreEndpoint;
    selected: boolean;
    content: Active extends true ? TabRendererContent : undefined;
}

export enum ChannelTab {
    Featured = "featured",
    Videos = "videos",
    Shorts = "shorts",
    /**
     * aka "Live"
     */
    Streams = "streams",
    Releases = "releases",
    Playlists = "playlists",
    Podcasts = "podcasts",
    Community = "community",
    Store = "store",
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

    public async fetchAbout(): Promise<Result<AboutData, Error>> {
        if (!this.data.ytInitialData)
            return err(new Error(`Something went wrong!`));

        let continuationRenderer;

        const ytInitialData = this.data.ytInitialData as any;

        if ("pageHeaderRenderer" in ytInitialData.header) {
            const model =
                ytInitialData.header.pageHeaderRenderer.content
                    .pageHeaderViewModel;

            if (!model) return err(new Error(`No header present!`));

            const moreEndpoint =
                model.attribution.attributionViewModel.suffix.commandRuns[0]
                    .onTap.innertubeCommand.showEngagementPanelEndpoint;

            if (!moreEndpoint)
                return err(
                    new Error(`No about continuation renderer present!`),
                );

            continuationRenderer =
                moreEndpoint.engagementPanel.engagementPanelSectionListRenderer
                    .content.sectionListRenderer.contents[0].itemSectionRenderer
                    .contents[0].continuationItemRenderer;
        } else if ("c4TabbedHeaderRenderer" in ytInitialData.header) {
            const links =
                ytInitialData.header?.c4TabbedHeaderRenderer?.headerLinks;
            if (!links) return err(new Error(`No header links present!`));

            const model = (links as any).channelHeaderLinksViewModel;

            if (!model) return err(new Error(`No header present!`));
            if (!model.more)
                return err(
                    new Error(`No about continuation renderer present!`),
                );

            const moreEndpoint =
                model.more.commandRuns[0].onTap.innertubeCommand
                    .showEngagementPanelEndpoint;

            if (!moreEndpoint)
                return err(
                    new Error(`No about continuation renderer present!`),
                );

            continuationRenderer =
                moreEndpoint.engagementPanel.engagementPanelSectionListRenderer
                    .content.sectionListRenderer.contents[0].itemSectionRenderer
                    .contents[0].continuationItemRenderer;
        }

        if (!continuationRenderer)
            return err(new Error(`No about continuation renderer present!`));

        const data = await this.browse<any>({
            clickTrackingParams: continuationRenderer.clickTrackingParams,
            visitorData: this.getVisitorData(),
            token: continuationRenderer.continuationEndpoint.continuationCommand
                .token,
        });

        if (data.isErr()) return err(data.error);

        const {
            onResponseReceivedEndpoints: [
                {
                    appendContinuationItemsAction: { continuationItems },
                },
            ],
        } = data.value;

        const channelData = continuationItems[0].aboutChannelRenderer.metadata;

        try {
            return ok(extractAboutData(channelData));
        } catch (error) {
            return err(error as Error);
        }
    }

    public getChannelData(): Result<ChannelData, Error> {
        try {
            return ok(
                extractChannelData(
                    this.data.ytInitialData.microformat!
                        .microformatDataRenderer,
                ),
            );
        } catch (error) {
            return err(error as Error);
        }
    }
}

export interface AboutData {
    description: string;
    links: { title: string; url: string }[];
}

function getTabName(path: string): Result<ChannelTab, Error> {
    const [, channel, tab] = path.trim().split("/") as [void, string, string];
    if (!tab) return err(new Error(`Could not extract tab name from ${path}.`));
    if (!IS_CHANNEL_TAB_LOOKUP.has(tab as any))
        return err(
            new YoutubejsError(YtjsErrorCode.UnknownChannelTab, channel, tab),
        );

    return ok(tab as ChannelTab);
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
