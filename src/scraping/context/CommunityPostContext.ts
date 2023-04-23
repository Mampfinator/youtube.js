import { err, ok, Result } from "neverthrow";
import { extractCommunityPost } from "../extractors/community-posts";
import { CommunityPost, ChannelData } from "../types";
import { Context } from "./decorators/Context";
import { ScrapingContext } from "./ScrapingContext";
import { extractChannelData } from "../extractors/channel-data";

/**
 * Context for individual community posts.
 */
@Context(
    /(?<=youtube.com\/post\/)Ug[A-z0-9_\-]+|(?<=youtube.com\/channel\/.+\/community\?lb=)Ug[A-z0-9_\-]/,
    2 /* needs to be evaluated **before** CommunityContext */,
)
export class CommunityPostContext extends ScrapingContext {
    public getPost(): Result<CommunityPost, Error> {
        try {
            const renderer =
                this.data.ytInitialData.contents.twoColumnBrowseResultsRenderer!.tabs![0]!.tabRenderer!.content!.sectionListRenderer!.contents.find(
                    (renderer: any) =>
                        renderer.itemSectionRenderer.sectionIdentifier ===
                        "backstage-item-section",
                )!.itemSectionRenderer!.contents[0]!
                    .backstagePostThreadRenderer!.post;
            return ok(
                extractCommunityPost(
                    (renderer.backstagePostRenderer ??
                        renderer.sharedPostRenderer)!,
                ),
            );
        } catch (error) {
            return err(error as Error);
        }
    }

    public getChannelData(): Result<ChannelData, Error> {
        try {
            return ok(
                extractChannelData(
                    this.data.ytInitialData.microformat!
                        .microformatDataRenderer,
                ),
            );
        } catch (error) {
            return err(error as Error);
        }
    }
}
