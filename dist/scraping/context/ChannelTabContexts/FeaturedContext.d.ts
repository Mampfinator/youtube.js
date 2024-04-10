import { Result } from "neverthrow";
import { ChannelTabContext } from "./ChannelTabContext";
import { FeaturedChannelSection } from "../../types";
/**
 * Channel context for `/featured`.
 * Is returned for every channel route that does **not** match any subroute (to mimic behaviour on YouTube itself).
 */
export declare class FeaturedContext extends ChannelTabContext {
    getFeaturedChannels(): Result<FeaturedChannelSection[], Error>;
}
