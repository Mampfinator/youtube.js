import { Result } from "neverthrow";
import { FullChannelData } from "../../types";
import { ChannelTabContext } from "./ChannelTabContext";
/**
 * Channel context for `/about`.
 */
export declare class AboutContext extends ChannelTabContext {
    getAbout(): Result<FullChannelData, Error>;
}
