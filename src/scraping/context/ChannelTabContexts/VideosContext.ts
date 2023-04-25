import { Err, ok, err, Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { extractVideo } from "../../extractors/videos";
import { ScrapedVideo } from "../../types";
import {
    GridVideoRenderer,
    PurpleVideoRenderer,
} from "../../types/internal/generated";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTab, ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";
/**
 * Channel context for `/videos`.
 */
@Context(getChannelTabRegex(ChannelTab.Videos), DEFAULT_WEIGHT + 1)
export class VideosContext extends Mixin(
    ChannelTabContext,
    ElementContext<ScrapedVideo>,
) {
    private toVideos(
        renderers: (GridVideoRenderer | PurpleVideoRenderer)[],
    ): Map<string, ScrapedVideo> {
        const map = new Map<string, ScrapedVideo>();

        for (const renderer of renderers) {
            const stream = extractVideo(renderer as any);
            map.set(stream.id, stream);
        }

        return map;
    }

    protected async *getElements(): AsyncGenerator<
        Result<{ elements: Map<string, ScrapedVideo> }, Error[]>,
        any,
        unknown
    > {
        const data = this.getData();
        if (data.isErr() || !data.value) {
            yield err([
                (data as Err<any, any>).error ?? new Error("Empty data!"),
            ]);
            return;
        }

        const renderers = data.value.richGridRenderer!.contents;

        yield ok({
            elements: this.toVideos(
                renderers
                    .map(
                        ({ richItemRenderer }) =>
                            richItemRenderer?.content.videoRenderer!,
                    )
                    .filter(i => i),
            ),
        });

        const continuationRenderer =
            renderers[renderers.length - 1]?.continuationItemRenderer;
        if (!continuationRenderer) return;

        const clickTrackingParams = data.value.richGridRenderer!.trackingParams;
        const visitorData = this.getVisitorData();
        let { token } =
            continuationRenderer.continuationEndpoint.continuationCommand;

        try {
            while (token) {
                const continuation = await this.browse({
                    token,
                    clickTrackingParams,
                    visitorData,
                });

                if (continuation.isErr())
                    return yield err([continuation.error]);

                const items = continuation.value
                    .onResponseReceivedActions!.map(
                        ({ appendContinuationItemsAction }) =>
                            appendContinuationItemsAction?.continuationItems,
                    )
                    .filter(i => i)
                    .flat();

                yield ok({
                    elements: this.toVideos(
                        items
                            .map(
                                item =>
                                    item.richItemRenderer?.content
                                        .videoRenderer,
                            )
                            .filter(i => i),
                    ),
                });

                token =
                    items[items.length - 1].continuationItemRenderer
                        ?.continuationEndpoint.continuationCommand.token;
            }
        } catch (error) {
            yield err([error as Error]);
            return;
        }
    }
}
