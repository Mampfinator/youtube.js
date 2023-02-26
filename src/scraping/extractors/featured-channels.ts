import { DeepRequired } from "../../shared/types";
import { mergeRuns, sanitizeUrl } from "../scraping.util";
import {
    FeaturedChannelSection,
    FeaturedChannelType,
    FullFeaturedChannel,
    PartialFeaturedChannel,
} from "../types/external/featured-channels";
import {
    ChannelRenderer,
    GridChannelRenderer,
    PurpleShelfRenderer,
} from "../types/internal/generated";

/**
 * Extracts a featured channel section from a section renderer.
 */
export function extractFeaturedChannelSections(
    renderers: PurpleShelfRenderer[],
): FeaturedChannelSection[] {
    const sections: FeaturedChannelSection[] = [];

    for (const {
        title: { runs },
        content: { expandedShelfContentsRenderer, horizontalListRenderer },
    } of renderers) {
        sections.push({
            title: mergeRuns(runs),
            channels: expandedShelfContentsRenderer
                ? expandedShelfContentsRenderer.items
                      .map(({ channelRenderer }) => channelRenderer!)
                      .map(extractFullFeaturedChannel)
                : horizontalListRenderer!.items
                      .map(({ gridChannelRenderer }) => gridChannelRenderer!)
                      .map(extractPartialFeaturedChannel),
        });
    }

    return sections;
}

/**
 * Extracts a single featured channel from items in a section renderer.
 */
export function extractFullFeaturedChannel(
    renderer: ChannelRenderer,
): FullFeaturedChannel {
    const {
        channelId: id,
        title: { simpleText: name },
        thumbnail: { thumbnails },
        descriptionSnippet,
    } = renderer;

    return {
        type: FeaturedChannelType.Full,
        id,
        name,
        avatar: sanitizeUrl(thumbnails[thumbnails.length - 1].url),
        descriptionSnippet: descriptionSnippet.runs.map(
            ({ text, url }: any) => ({ text, url }),
        ),
    };
}

export function extractPartialFeaturedChannel(
    renderer: GridChannelRenderer,
): PartialFeaturedChannel {
    const {
        channelId: id,
        thumbnail: { thumbnails },
        title: { simpleText: name },
    } = renderer;

    return {
        type: FeaturedChannelType.Partial,
        id,
        name,
        avatar: sanitizeUrl(thumbnails[thumbnails.length - 1].url),
    };
}
