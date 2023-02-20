import { err, ok, Result } from "neverthrow";
import { extractCommunityPost } from "../extractors/community-posts";
import { CommunityPost } from "../types/external/community-posts";
import { Context } from "./decorators/Context";
import { ScrapingContext } from "./ScrapingContext";



/**
 * Context for individual community posts. 
 */
@Context(/(?<=youtube.com\/post\/)Ug[A-z0-9_\-]+|(?<=youtube.com\/channel\/.+\/community\?lb=)Ug[A-z0-9_\-]/, 2 /* needs to be evaluated **before** CommunityContext */)
export class CommunityPostContext extends ScrapingContext {
    public getPost(): Result<CommunityPost, Error> {
        try {
            // god I love working with ytInitialData
            const renderer = this.data.ytInitialData.contents.twoColumnBrowseResultsRenderer!.tabs![0]!.tabRenderer!.content!.sectionListRenderer!.contents.find((renderer: any) => renderer.itemSectionRenderer.sectionIdentifier === "backstage-item-section")!.itemSectionRenderer!.contents[0]!.backstagePostThreadRenderer!.post;
            return ok(extractCommunityPost((renderer.backstagePostRenderer ?? renderer.sharedPostRenderer)!));
                
        } catch (error) {
            return err(error as Error);
        }
    }
}