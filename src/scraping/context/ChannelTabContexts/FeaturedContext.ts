import { Err, Result, err, ok } from "neverthrow";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ChannelTabContext, CHANNEL_BASE_REGEX } from "./ChannelTabContext";
import { FeaturedChannelSection } from "../../types";
import { FluffyRun, GridChannelRenderer } from "../../types/internal/generated";
import { extractPartialFeaturedChannel } from "../../extractors/featured-channels";
import { mergeRuns } from "../../scraping.util";

/**
 * Channel context for `/featured`.
 * Is returned for every channel route that does **not** match any subroute (to mimic behaviour on YouTube itself).
 */
@Context(CHANNEL_BASE_REGEX, DEFAULT_WEIGHT)
export class FeaturedContext extends ChannelTabContext {
    public getFeaturedChannels(): Result<FeaturedChannelSection[], Error> {
        const data = this.getData();

        if (data.isErr()) return data as Err<never, Error>;

        const contents = data.value?.sectionListRenderer?.contents;

        if (!contents) return err(new Error("Empty channel data"));

        const channelSections = contents
            .map(section => section.itemSectionRenderer)
            .filter(section =>
                section?.contents.filter(sectionItems =>
                    sectionItems.shelfRenderer?.content.horizontalListRenderer?.items.some(
                        item => item.gridChannelRenderer,
                    ),
                ),
            )
            .map(section => {
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

                const channels = section.contents
                    .map(sectionItems => {
                        return sectionItems.shelfRenderer?.content.horizontalListRenderer?.items
                            .map(item => item.gridChannelRenderer)
                            .filter(c => c);
                    })
                    .flat()
                    .filter(c => !!c) as GridChannelRenderer[];

                if (channels.length === 0) {
                    return null;
                } else {
                    return {
                        title: title ?? "",
                        channels: channels.map(extractPartialFeaturedChannel),
                    };
                }
            })
            .filter(c => c !== null) as FeaturedChannelSection[];

        return ok(channelSections);
    }
}
