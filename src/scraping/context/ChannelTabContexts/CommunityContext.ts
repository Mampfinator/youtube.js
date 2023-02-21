import { err, ok, Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { extractCommunityPost } from "../../extractors/community-posts";
import { CommunityPost } from "../../types/external/community-posts";
import { Post } from "../../types/internal/generated";
import { Context } from "../decorators/Context";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

/**
 * Channel context for `/community`.
 */
@Context(getChannelTabRegex("community"), 10)
export class CommunityContext extends Mixin(ChannelTabContext, ElementContext<CommunityPost>) {
    
    private toCommunityPosts(renderers: Post[]): Map<string, CommunityPost> {
        const map = new Map<string, CommunityPost>();

        for (const renderer of renderers.map(({backstagePostRenderer, sharedPostRenderer}) => (backstagePostRenderer ?? sharedPostRenderer)!)) {
            const post = extractCommunityPost(renderer);
            map.set(post.id, post);
        }

        return map;
    }
    
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, CommunityPost>; }, Error[]>, any, unknown> {
        const data = this.getData();
        if (data.isErr()) {
            yield err([data.error]);
            return;
        }

        // TODO: fix continuation request

        const list = data.value!.sectionListRenderer!.contents[0]!.itemSectionRenderer.contents;

        yield ok({
            elements: this.toCommunityPosts(
                list.map(({backstagePostThreadRenderer}) => backstagePostThreadRenderer?.post).filter(renderer => renderer) as Post[]) 
        });

        const last = list[list.length - 1];
        if (!last?.continuationItemRenderer) return;

        let trackingParams = data.value?.sectionListRenderer!.trackingParams!;
        let {token} = last.continuationItemRenderer!.continuationEndpoint!.continuationCommand!;
        
        const visitorData = this.getVisitorData();

        try {
            while (token) {
                const continuedData = await this.browse({
                    token,
                    clickTrackingParams: trackingParams,
                    visitorData
                });
                
                if (continuedData.isErr()) {
                    yield err([continuedData.error]);
                    return;
                }

                const items = ((continuedData.value.onResponseReceivedActions ?? (continuedData.value as any).onResponseReceivedEndpoints) as any).map(({appendContinuationItemsAction}: any) => appendContinuationItemsAction?.continuationItems).filter((i: any) => i).flat();
                yield ok({elements: this.toCommunityPosts(items.map(({backstagePostThreadRenderer}: any) => backstagePostThreadRenderer?.post).filter((item: any) => item?.backstagePostRenderer ?? item?.sharedPostRenderer))});

                token = items[items.length -1]?.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
            }
        } catch (error) {
            yield err([error as Error]);
            return;
        }
    }

}