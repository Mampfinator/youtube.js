import { Context } from "../decorators/Context";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

/**
 * Channel context for `/about`.
 */
@Context(getChannelTabRegex("about"), 10)
export class AboutContext extends ChannelTabContext {}