export enum FeaturedChannelType {
    Full = "Full",
    Partial = "Partial",
}

export type FeaturedChannel = FullFeaturedChannel | PartialFeaturedChannel;

interface BaseFeaturedChannel {
    id: string;
    name: string;
    avatar: string;
}

export interface PartialFeaturedChannel extends BaseFeaturedChannel {
    type: FeaturedChannelType.Partial;
}

export interface FullFeaturedChannel extends BaseFeaturedChannel {
    type: FeaturedChannelType.Full;
    descriptionSnippet?: { text: string; url?: string }[];
}

export interface FeaturedChannelSection {
    title: string;
    channels: FeaturedChannel[];
}
