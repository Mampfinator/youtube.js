import { Match } from "../decorators/Match";
import { ChannelTabContext, getChannelTabRegex } from "./ChannelTabContext";

/**
 * Channel context for /about.
 */
@Match(getChannelTabRegex("about"), 10)
export class AboutContext extends ChannelTabContext {}