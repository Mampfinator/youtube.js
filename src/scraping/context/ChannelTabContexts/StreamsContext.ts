import { err, ok, Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { extractStream } from "../../extractors/videos";
import { getContinuationItems } from "../../scraping.util";
import { ScrapedStream } from "../../types";
import {
    GridVideoRenderer,
    PurpleVideoRenderer,
} from "../../types/internal/generated";
import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

/**
 * Channel context for `/streams`.
 */
@Context(getChannelTabRegex("streams"), DEFAULT_WEIGHT + 1)
export class StreamsContext extends Mixin(
    ChannelTabContext,
    ElementContext<ScrapedStream>,
) {
    private toStreams(
        renderers: (GridVideoRenderer | PurpleVideoRenderer)[],
    ): Map<string, ScrapedStream> {
        const map = new Map<string, ScrapedStream>();

        for (const renderer of renderers) {
            const stream = extractStream(renderer as any);
            map.set(stream.id, stream);
        }

        return map;
    }

    protected async *getElements(): AsyncGenerator<
        Result<{ elements: Map<string, ScrapedStream> }, Error[]>,
        any,
        unknown
    > {
        const data = this.getData();
        if (data.isErr()) {
            yield err([data.error]);
            return;
        } else if (!data.value) {
            yield err([new Error("Empty data!")]);
            return;
        }

        const renderers = data.value.richGridRenderer!.contents!;

        yield ok({
            elements: this.toStreams(
                renderers
                    .map(
                        ({ richItemRenderer }) =>
                            richItemRenderer?.content?.videoRenderer!,
                    )
                    .filter(i => i),
            ),
        });

        const last = renderers[renderers.length - 1];
        if (!last?.continuationItemRenderer) return;

        const clickTrackingParams = data.value.richGridRenderer?.trackingParams;
        const visitorData = this.getVisitorData();

        let { token } =
            last.continuationItemRenderer!.continuationEndpoint
                .continuationCommand;

        try {
            while (token) {
                const continuation = await this.browse({
                    token,
                    clickTrackingParams,
                    visitorData,
                });

                if (continuation.isErr())
                    return yield err([continuation.error]);

                const items = getContinuationItems(continuation.value);

                yield ok({
                    elements: this.toStreams(
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
            return err([error as Error]);
        }
    }
}
