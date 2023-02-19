import { Match } from "../decorators/Match";
import { ChannelTabContext, CHANNEL_BASE_REGEX } from "./ChannelTabContext";

/**
 * Channel context for `/featured`. Is returned for every channel route that does **not** match any subroute (to mimic behaviour on YouTube itself). 
 */
@Match(CHANNEL_BASE_REGEX, 5)
export class HomeContext extends ChannelTabContext {}