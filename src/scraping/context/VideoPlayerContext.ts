import { Result } from "neverthrow";
import { Extractors } from "../extractors";
import { YtInitialData, YtInitialPlayerResponse } from "../types/internal";
import { Match } from "./decorators/Match";
import { ScrapingContext } from "./ScrapingContext";

@Match(/youtube\.com\/watch\?|youtu\.be\//)
export class VideoPlayerContext extends ScrapingContext<{ytInitialData: YtInitialData, ytInitialPlayerResponse: YtInitialPlayerResponse}> {
    protected extract(body: string) {

        const result = Result.combine([
            Extractors.ytInitialData(body),
            Extractors.ytInitialPlayerResponse(body),
        ]);

        if (result.isErr()) throw result.error;

        const [ytInitialData, ytInitialPlayerResponse] = result.value;
        return {ytInitialData, ytInitialPlayerResponse};
    }
}