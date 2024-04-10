import { err, ok, Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import {
    extractShelfSection,
    extractDefaultGridSection,
} from "../../extractors/featured-channels";
import { FeaturedChannelSection } from "../../types";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import {
    ChannelTab,
    ChannelTabContext,
    getChannelTabRegex,
} from "./ChannelTabContext";

/**
 * Channel context for `/channels`.
 */
@Context(getChannelTabRegex(ChannelTab.Channels), DEFAULT_WEIGHT + 1)
export class ChannelsContext extends Mixin(
    ChannelTabContext,
    ElementContext<FeaturedChannelSection, string | null>,
) {
    protected async *getElements(): AsyncGenerator<
        Result<{ elements: Map<string | null, FeaturedChannelSection> }, Error[]>,
        any,
        unknown
    > {
        const data = this.getData();
        if (data.isErr()) return yield err([data.error]);
        if (!data.value) return yield err([new Error("Empty data!")]);

        const sections = data.value
            .sectionListRenderer!.contents.map(
                ({ itemSectionRenderer }) => itemSectionRenderer?.contents!,
            )
            .flat()
            .map(({ shelfRenderer, gridRenderer }) => {
                const sections: (FeaturedChannelSection | null)[] = [];
                if (shelfRenderer)
                    sections.push(extractShelfSection(shelfRenderer));
                if (gridRenderer)
                    sections.push(extractDefaultGridSection(gridRenderer));
                return sections.filter(c => c !== null) as FeaturedChannelSection[];
            })
            .flat()
            .filter(i => i);

        return yield ok({
            elements: new Map(
                sections.map(section => [section.title, section]),
            ),
        });
    }
}
