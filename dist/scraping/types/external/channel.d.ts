export interface ChannelData {
    id: string;
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
