export interface ChannelData {
    // We may not get anything to infer an ID from from the microformat renderer, as is the case with community posts.
    id?: string;
    name: string;
    avatar: string;
    description: string;
    url: string;
    tags: string[];
    unlisted: boolean;
}

export interface FullChannelData extends ChannelData {
    primaryLinks: PrimaryLink[];
    channelViews: number;
}

export interface PrimaryLink {
    title: string;
    icon: string;
    url: string;
}
