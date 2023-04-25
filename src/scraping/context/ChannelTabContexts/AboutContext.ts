import { Context, DEFAULT_WEIGHT } from "../decorators/Context";
import { ChannelTab, ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

/**
 * Channel context for `/about`.
 */
@Context(getChannelTabRegex(ChannelTab.About), DEFAULT_WEIGHT + 1)
export class AboutContext extends ChannelTabContext {}
