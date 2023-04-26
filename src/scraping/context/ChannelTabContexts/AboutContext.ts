import { Err, Result, err, ok } from "neverthrow";
import { FullChannelData } from "../../types";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import {
    ChannelTab,
    ChannelTabContext,
    getChannelTabRegex,
} from "./ChannelTabContext";
import { sanitizeUrl } from "../../scraping.util";

/**
 * Channel context for `/about`.
 */
@Context(getChannelTabRegex(ChannelTab.About), DEFAULT_WEIGHT + 1)
export class AboutContext extends ChannelTabContext {
    public getAbout(): Result<FullChannelData, Error> {
        const data = this.getData();
        if (data.isErr()) return data as Err<never, Error>;
        if (!data.value) return err(new Error("Empty data!"));

        const baseData = this.getChannelData();
        if (baseData.isErr()) return baseData as Err<never, Error>;

        const aboutRenderer =
            data.value.sectionListRenderer?.contents[0].itemSectionRenderer
                .contents[0].channelAboutFullMetadataRenderer;

        if (!aboutRenderer) return err(new Error("About renderer not found"));

        const {
            primaryLinks,
            viewCountText: { simpleText: viewText },
        } = aboutRenderer;

        return ok({
            ...baseData.value,
            primaryLinks: primaryLinks.map(
                ({
                    icon: {
                        thumbnails: [{ url: iconUrl }],
                    },
                    title: { simpleText: title },
                    navigationEndpoint: {
                        urlEndpoint: { url: rawUrl },
                    },
                }) => ({
                    title,
                    icon: sanitizeUrl(iconUrl),
                    url: decodeURIComponent(
                        new URL(rawUrl).searchParams.get("q")!,
                    ),
                }),
            ),
            channelViews: Number(
                [...viewText.matchAll(/[0-9]+/g)]!.map(arr => arr[0]).join(""),
            ),
        });
    }
}
