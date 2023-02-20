import { err, ok, Result } from "neverthrow";
import { Mixin } from "ts-mixer";
import { extractCommunityPost } from "../../extractors/community-posts";
import { CommunityPost } from "../../types/external/community-posts";
import { Post, PostBackstagePostRenderer } from "../../types/internal/generated";
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
            map.set(renderer.postId, extractCommunityPost(renderer))
        }

        return map;
    }
    
    protected async* getElements(): AsyncGenerator<Result<{ elements: Map<string, CommunityPost>; }, Error[]>, any, unknown> {
        const data = this.getData();
        if (data.isErr()) {
            yield err([data.error]);
            return;
        }

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

                const items = continuedData.value.onResponseReceivedActions!.continuationItems!;
                yield ok({elements: this.toCommunityPosts(items.filter(item => item.backstagePostRenderer ?? item.sharedPostRenderer))});

                token = items[items.length -1]?.continuationEndpoint.continuationCommand?.token;
            }
        } catch (error) {
            return err(error as Error);
        }
    }

}