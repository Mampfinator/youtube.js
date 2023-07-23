import { Override, Replace } from "../../base-types";
import { ChannelIdentifier, ChannelResourceParts, ContentOwnerDetails, Snippet } from "./api-types";
export type ParsedChannelParts = Override<ChannelResourceParts, {
    snippet: Replace<Snippet, "publishedAt", Date>;
    contentOwnerDetails: Replace<ContentOwnerDetails, "timeLinked", Date>;
}>;
export type ChannelPart = keyof ParsedChannelParts;
export type Channel<TPart extends ChannelPart> = ChannelIdentifier & Pick<ParsedChannelParts, TPart>;
