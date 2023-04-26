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

        const sections = data.value
            .sectionListRenderer!.contents.map(
                ({ itemSectionRenderer }) => itemSectionRenderer?.contents!,
            )
            .flat()
            .map(({ shelfRenderer, gridRenderer }) => {
                const sections: FeaturedChannelSection[] = [];
                if (shelfRenderer)
                    sections.push(extractShelfSection(shelfRenderer));
                if (gridRenderer)
                    sections.push(extractDefaultGridSection(gridRenderer));
                return sections;
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
