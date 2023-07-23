import { FeaturedChannelSection, FullFeaturedChannel, PartialFeaturedChannel } from "../types/external/featured-channels";
import { ChannelRenderer, GridChannelRenderer, GridRenderer, PurpleShelfRenderer } from "../types/internal/generated";
export declare const DEFAULT_CHANNEL_SECTION = "DEFAULT_CHANNEL_SECTION";
/**
 * Extracts a featured channel section from a section shelf renderer.
 */
export declare function extractShelfSection(renderer: PurpleShelfRenderer): FeaturedChannelSection;
/**
 *
 * @param renderers
 * @returns
 */
export declare function extractDefaultGridSection(renderers: GridRenderer): FeaturedChannelSection;
/**
 * Extracts a single featured channel from items in a section renderer.
 */
export declare function extractFullFeaturedChannel(renderer: ChannelRenderer): FullFeaturedChannel;
export declare function extractPartialFeaturedChannel(renderer: GridChannelRenderer): PartialFeaturedChannel;
