import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

/**
 * Channel context for `/about`.
 */
@Context(getChannelTabRegex("about"), DEFAULT_WEIGHT + 1)
export class AboutContext extends ChannelTabContext {}
