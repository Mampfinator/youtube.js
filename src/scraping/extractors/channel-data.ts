import { sanitizeUrl } from "../scraping.util";
import { ChannelData } from "../types/external/channel";
import { MicroformatDataRenderer } from "../types/internal/generated";

export function extractChannelData(
    input: MicroformatDataRenderer,
): ChannelData {
    const {
        title: name,
        description,
        tags,
        unlisted,
        urlCanonical: url,
        thumbnail: {
            thumbnails: [{ url: thumbUrl }],
        },
    } = input;

    const id = /(?<=channel\/).+/.exec(url)?.[0];

    return {
        id,
        name,
        avatar: sanitizeUrl(thumbUrl),
        description,
        url,
        tags: tags ?? [],
        unlisted,
    };
}
