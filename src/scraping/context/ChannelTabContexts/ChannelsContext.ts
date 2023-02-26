import { err, ok, Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { extractFeaturedChannelSections } from "../../extractors/featured-channels";
import { FeaturedChannelSection } from "../../types";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

/**
 * Channel context for `/channels`.
 */
@Context(getChannelTabRegex("channels"), DEFAULT_WEIGHT + 1)
export class ChannelsContext extends Mixin(
    ChannelTabContext,
    ElementContext<FeaturedChannelSection>,
) {
    protected async *getElements(): AsyncGenerator<
        Result<{ elements: Map<string, FeaturedChannelSection> }, Error[]>,
        any,
        unknown
    > {
        const data = this.getData();
        if (data.isErr()) return yield err([data.error]);
        if (!data.value) return yield err([new Error("Empty data!")]);

        const renderers = data.value
            .sectionListRenderer!.contents.map(
                ({ itemSectionRenderer }) =>
                    itemSectionRenderer
                        ?.contents!.map(({ shelfRenderer }) => shelfRenderer!)
                        .filter(i => i)!,
            )
            .flat();

        return yield ok({
            elements: new Map(
                extractFeaturedChannelSections(renderers).map(section => [
                    section.title,
                    section,
                ]),
            ),
        });
    }
}
