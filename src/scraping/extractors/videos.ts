import { sanitizeUrl } from "../scraping.util";
import {
    ScrapedShort,
    ScrapedStream,
    ScrapedVideo,
    StreamStatus,
    VideoType,
} from "../types/external/videos";
import {
    GridVideoRenderer,
    ItemReelItemRenderer,
    PurpleVideoRenderer,
} from "../types/internal/generated";

export function extractVideo(
    renderer: GridVideoRenderer & PurpleVideoRenderer,
): ScrapedVideo {
    const {
        videoId: id,
        thumbnail: { thumbnails },
        title: { simpleText: title, runs: titleRuns },
    } = renderer;

    return {
        type: VideoType.Video,
        id,
        title: title ?? titleRuns.map(({ text }) => text).join(""),
        thumbnail: sanitizeUrl(thumbnails[thumbnails.length - 1].url),
    };
}

export function extractShort(renderer: ItemReelItemRenderer): ScrapedShort {
    const {
        videoId: id,
        headline: { simpleText: title },
        thumbnail: { thumbnails },
        videoType,
    } = renderer;

    return {
        type: VideoType.Short,
        id,
        title,
        thumbnail: sanitizeUrl(thumbnails[thumbnails.length - 1].url),
    };
}

const STATUS_LOOKUP = {
    DEFAULT: StreamStatus.Offline,
    UPCOMING: StreamStatus.Upcoming,
    LIVE: StreamStatus.Live,
};

export function extractStream(
    renderer: GridVideoRenderer & PurpleVideoRenderer,
): ScrapedStream {
    const {
        videoId: id,
        title: { simpleText: title, runs: titleRuns },
        thumbnail: { thumbnails },
        thumbnailOverlays,
    } = renderer;

    const overlay = thumbnailOverlays.find(
        overlay => overlay.thumbnailOverlayTimeStatusRenderer,
    )!.thumbnailOverlayTimeStatusRenderer!;

    const status: StreamStatus | undefined =
        STATUS_LOOKUP[overlay.style as "DEFAULT" | "LIVE" | "UPCOMING"];

    if (!status)
        throw new Error(
            `Could not determine stream status for overlay style ${overlay.style}`,
        );

    return {
        type: VideoType.Stream,
        id,
        title: title ?? titleRuns.map(({ text }) => text).join(""),
        thumbnail: sanitizeUrl(thumbnails[thumbnails.length - 1].url),
        status,
    };
}
