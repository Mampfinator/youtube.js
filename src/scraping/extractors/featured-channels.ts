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
    GridRenderer,
    PurpleShelfRenderer,
} from "../types/internal/generated";

export const DEFAULT_CHANNEL_SECTION = "DEFAULT_CHANNEL_SECTION";

/**
 * Extracts a featured channel section from a section shelf renderer.
 */
export function extractShelfSection(
    renderer: PurpleShelfRenderer,
): FeaturedChannelSection {
    const {
        title: { runs } = { runs: [] },
        content: { expandedShelfContentsRenderer, horizontalListRenderer },
    } = renderer;

    return {
        title: mergeRuns(runs),
        channels: expandedShelfContentsRenderer
            ? expandedShelfContentsRenderer.items
                  .map(({ channelRenderer }) => channelRenderer!)
                  .map(extractFullFeaturedChannel)
            : horizontalListRenderer!.items
                  .map(({ gridChannelRenderer }) => gridChannelRenderer!)
                  .map(extractPartialFeaturedChannel),
    };
}

/**
 *
 * @param renderers
 * @returns
 */
export function extractDefaultGridSection(
    renderers: GridRenderer,
): FeaturedChannelSection {
    return {
        title: DEFAULT_CHANNEL_SECTION,
        channels: renderers.items
            .map(({ gridChannelRenderer }) => gridChannelRenderer!)
            .filter(i => i)
            .map(extractPartialFeaturedChannel),
    };
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
        descriptionSnippet: descriptionSnippet?.runs.map(
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
