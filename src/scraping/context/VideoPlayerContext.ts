import { Result } from "neverthrow";
import { DataExtractors } from "../extractors/data-extractors";
import { YtInitialData, YtInitialPlayerResponse } from "../types/internal";
import { Context } from "./decorators/Context";
import { ScrapingContext } from "./ScrapingContext";

@Context(/youtube\.com\/watch\?|youtu\.be\//)
export class VideoPlayerContext extends ScrapingContext<{
    ytInitialData: YtInitialData;
    ytInitialPlayerResponse: YtInitialPlayerResponse;
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
}
