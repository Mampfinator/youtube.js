import { Err, Result, err, ok } from "neverthrow";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ChannelTabContext, CHANNEL_BASE_REGEX } from "./ChannelTabContext";
import {
    FeaturedChannel,
    FeaturedChannelSection,
    PartialFeaturedChannel,
} from "../../types";
import {
    ContinuationEndpoint,
    FluffyRun,
    GridRenderer,
} from "../../types/internal/generated";
import {
    extractFullFeaturedChannel,
    extractPartialFeaturedChannel,
} from "../../extractors/featured-channels";
import { getContinuationItems, mergeRuns } from "../../scraping.util";

/**
 * Channel context for `/featured`.
 * Is returned for every channel route that does **not** match any subroute (to mimic behaviour on YouTube itself).
 */
@Context(CHANNEL_BASE_REGEX, DEFAULT_WEIGHT)
export class FeaturedContext extends ChannelTabContext {
    public async getFeaturedChannels(): Promise<
        Result<FeaturedChannelSection[], Error>
    > {
        const data = this.getData();

        if (data.isErr()) return data as Err<never, Error>;

        const contents = data.value?.sectionListRenderer?.contents;

        if (!contents) return err(new Error("Empty channel data"));

        // TODO: check for potential continuations? Although I'm *somewhat* sure channels are usually all included.
        const channelSections = await Promise.all(
            contents
                .map(section => section.itemSectionRenderer)
                .filter(section =>
                    section?.contents.filter(
                        sectionItems =>
                            sectionItems.shelfRenderer?.content.horizontalListRenderer?.items.some(
                                item => item.gridChannelRenderer,
                            ) ??
                            !!sectionItems.shelfRenderer?.content
                                .expandedShelfContentsRenderer?.items[0]
                                ?.channelRenderer,
                    ),
                )
                .map(async section => {
                    const rawTitle = section.contents.find(
                        c => c.shelfRenderer?.title,
                    )?.shelfRenderer?.title;

                    if (!rawTitle) {
                        return null;
                    }

                    const title: string | null =
                        // @ts-ignore
                        rawTitle.simpleText ??
                        // @ts-ignore
                        mergeRuns(rawTitle.runs as FluffyRun[] | undefined) ??
                        null;

                    const channels = [];

                    const shelf = section.contents[0].shelfRenderer;

                    if (!shelf) return null;

                    if (shelf.content.expandedShelfContentsRenderer) {
                        for (const item of shelf.content
                            .expandedShelfContentsRenderer.items) {
                            if (item.channelRenderer) {
                                channels.push(
                                    extractFullFeaturedChannel(
                                        item.channelRenderer,
                                    ),
                                );
                            }
                        }
                    } else if (shelf.content.horizontalListRenderer) {
                        const listRenderer =
                            shelf.content.horizontalListRenderer;

                        const initial = listRenderer.items
                            .filter(item => item.gridChannelRenderer)
                            .map(item => item.gridChannelRenderer!);

                        console.log(`Initial channels: ${initial.length}`);

                        if (initial.length <= 0) return null;

                        // channel shelf renderers display a maximum of 12 initial channels. Any channels beyond that are only visible in the full engagement panel.
                        if (initial.length < 12) {
                            channels.push(
                                initial.map(extractPartialFeaturedChannel),
                            );
                        } else {
                            const engagementPanelEndpoint =
                                // @ts-expect-error
                                shelf.menu.menuRenderer.topLevelButtons[0]
                                    .buttonRenderer.navigationEndpoint
                                    .showEngagementPanelEndpoint;

                            console.log(engagementPanelEndpoint);

                            if (engagementPanelEndpoint) {
                                const continuationRenderer: ContinuationEndpoint =
                                    engagementPanelEndpoint.engagementPanel
                                        .engagementPanelSectionListRenderer
                                        .content.sectionListRenderer.contents[0]
                                        .itemSectionRenderer.contents[0]
                                        .continuationItemRenderer
                                        .continuationEndpoint;

                                const clickTrackingParams =
                                    continuationRenderer.clickTrackingParams;
                                const token =
                                    continuationRenderer.continuationCommand
                                        .token;

                                const continuation = await this.browse<any>({
                                    visitorData: this.getVisitorData(),
                                    clickTrackingParams,
                                    token,
                                });

                                if (continuation.isErr()) {
                                    console.error(continuation.error);
                                    return null;
                                }

                                const channelGrid: {
                                    gridRenderer: GridRenderer;
                                } = getContinuationItems(continuation.value)[0];

                                channels.push(
                                    ...channelGrid.gridRenderer.items
                                        .map(
                                            ({ gridChannelRenderer }) =>
                                                gridChannelRenderer!,
                                        )
                                        .map(extractPartialFeaturedChannel),
                                );
                            } else {
                                console.log(JSON.stringify(section, null, 4));
                            }
                        }
                    }

                    if (channels.length === 0) {
                        return null;
                    } else {
                        return {
                            title: title ?? "",
                            channels,
                        };
                    }
                }),
        ).then(
            sections =>
                sections.filter(c => c !== null) as FeaturedChannelSection[],
        );

        return ok(channelSections);
    }
}
