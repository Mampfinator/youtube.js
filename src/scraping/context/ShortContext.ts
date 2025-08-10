import { Result } from "neverthrow";
import { YtInitialData, YtInitialPlayerResponse } from "../types";
import { ScrapingContext } from "./ScrapingContext";
import { DataExtractors } from "../extractors/data-extractors";
import { CommentFetcher } from "../CommentFetcher";
import { Context } from "./decorators/Context";

@Context(/youtube\.com\/shorts\//)
export class ShortContext extends ScrapingContext<{
    ytInitialData: YtInitialData, ytInitialPlayerResponse: YtInitialPlayerResponse,
}> {
    protected extract(body: string) {
        const result = Result.combine([
            DataExtractors.ytInitialData(body),
            DataExtractors.ytInitialPlayerResponse(body),
        ]);

        if (result.isErr()) throw result.error;

        const [ytInitialData, ytInitialPlayerResponse] = result.value;
        return { ytInitialData, ytInitialPlayerResponse };
    }

    public comments(): CommentFetcher {
        const endpoint = (this.data.ytInitialData as any).engagementPanels[0].engagementPanelSectionListRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0]?.continuationItemRenderer?.continuationEndpoint;
        if (!endpoint) {
            throw new Error("No comments available for this short.");
        } 

        const trackingParams = endpoint.trackingParams;
        const token = endpoint.continuationCommand.token;
        return new CommentFetcher(
            this,
            trackingParams,
            token,
            "browse",
        );
    }
}