import { err, ok, Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { extractShort } from "../../extractors/videos";
import { getContinuationItems } from "../../scraping.util";
import { ScrapedShort } from "../../types";
import {
    ItemReelItemRenderer,
    PurpleContinuationItemRenderer,
} from "../../types/internal/generated";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import {
    ChannelTab,
    ChannelTabContext,
    getChannelTabRegex,
} from "./ChannelTabContext";

/**
 * Channel context for `/shorts`.
 */
@Context(getChannelTabRegex(ChannelTab.Shorts), DEFAULT_WEIGHT + 1)
export class ShortsContext extends Mixin(
    ChannelTabContext,
    ElementContext<ScrapedShort>,
) {
    private toShorts(
        renderers: ItemReelItemRenderer[],
    ): Map<string, ScrapedShort> {
        const map = new Map<string, ScrapedShort>();

        for (const renderer of renderers) {
            map.set(renderer.videoId, extractShort(renderer));
        }

        return map;
    }

    protected async *getElements(): AsyncGenerator<
        Result<{ elements: Map<string, ScrapedShort> }, Error[]>,
        undefined,
        unknown
    > {
        const data = this.getData();
        if (data.isErr()) {
            yield err([data.error]);
            return;
        }

        let continuationRenderer!: PurpleContinuationItemRenderer;
        const list: [
            ...ItemReelItemRenderer[],
            PurpleContinuationItemRenderer,
        ] = data.value!.richGridRenderer!.contents.map(
            ({ richItemRenderer, continuationItemRenderer }) =>
                (richItemRenderer?.content.reelItemRenderer ??
                    continuationItemRenderer)!,
        ) as any;

        if (
            (list[list.length - 1] as PurpleContinuationItemRenderer)
                .continuationEndpoint
        )
            continuationRenderer =
                list.pop()! as PurpleContinuationItemRenderer;

        yield ok({ elements: this.toShorts(list as ItemReelItemRenderer[]) });

        if (typeof continuationRenderer === "undefined") return;

        let clickTrackingParams = data.value?.richGridRenderer?.trackingParams;
        let { token } =
            continuationRenderer.continuationEndpoint.continuationCommand;
        const visitorData = this.getVisitorData();

        if (!clickTrackingParams || !token || !visitorData) return;

        try {
            while (token) {
                const continuation = await this.browse({
                    token,
                    clickTrackingParams,
                    visitorData,
                });

                if (continuation.isErr()) {
                    yield err([continuation.error]);
                    return;
                }

                const items = getContinuationItems(continuation.value);

                yield ok({
                    elements: this.toShorts(
                        items
                            .map(
                                item =>
                                    item.richItemRenderer?.content
                                        .reelItemRenderer,
                            )
                            .filter(i => i),
                    ),
                });
                token =
                    items[items.length - 1].continuationItemRenderer
                        ?.continuationEndpoint?.continuationCommand?.token;
            }
        } catch (error) {
            yield err([error as Error]);
        }
    }

    public async fetchComments(): Promise<Comment[]> {
        
        
        return [];
    }
}
