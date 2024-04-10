import { Result } from "neverthrow";
import { CommunityPost } from "../../types/external/community-posts";
import { ElementContext } from "../ElementContext";
import { ChannelTabContext } from "./ChannelTabContext";
declare const CommunityContext_base: import("ts-mixer/dist/types/types").Class<any[], ChannelTabContext<{
    ytInitialData: import("../../types/internal/generated").YtInitialData;
}> & ElementContext<CommunityPost, string>, (abstract new (options: import("..").ContextOptions) => ChannelTabContext<{
    ytInitialData: import("../../types/internal/generated").YtInitialData;
}>) & (abstract new (options: import("..").ContextOptions) => ElementContext<CommunityPost, string>), false>;
/**
 * Channel context for `/community`.
 */
export declare class CommunityContext extends CommunityContext_base {
    private toCommunityPosts;
    protected getElements(): AsyncGenerator<Result<{
        elements: Map<string, CommunityPost>;
    }, Error[]>, any, unknown>;
}
export {};
