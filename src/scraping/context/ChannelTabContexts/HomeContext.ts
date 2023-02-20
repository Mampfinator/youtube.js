import { Context } from "../decorators/Context";
import { ChannelTabContext, CHANNEL_BASE_REGEX } from "./ChannelTabContext";

/**
 * Channel context for `/featured`. Is returned for every channel route that does **not** match any subroute (to mimic behaviour on YouTube itself). 
 */
@Context(CHANNEL_BASE_REGEX, 5)
export class HomeContext extends ChannelTabContext {}