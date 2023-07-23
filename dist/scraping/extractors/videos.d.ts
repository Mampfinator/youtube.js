import { ScrapedShort, ScrapedStream, ScrapedVideo } from "../types/external/videos";
import { GridVideoRenderer, ItemReelItemRenderer, PurpleVideoRenderer } from "../types/internal/generated";
export declare function extractVideo(renderer: GridVideoRenderer & PurpleVideoRenderer): ScrapedVideo;
export declare function extractShort(renderer: ItemReelItemRenderer): ScrapedShort;
export declare function extractStream(renderer: GridVideoRenderer & PurpleVideoRenderer): ScrapedStream;
