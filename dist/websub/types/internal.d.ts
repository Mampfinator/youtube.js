import { XML_FEED_ATTRIBUTES } from "../websub.constants";
export type Mode = "subscribe" | "unsubscribe";
export type ResponseMode = Mode | "denied";
export interface Feed {
    link: string[];
    title: string;
    updated: Date;
    entry: Entry;
}
export interface Entry {
    id: string;
    "yt:videoId": string;
    "yt:channelId": string;
    title: string;
    link: string;
    author: Author;
    published: Date;
    updated: Date;
}
export interface Author {
    name: string;
    uri: string;
}
export interface WebSubMessage {
    "?xml": string;
    feed: Feed | DeletedFeed;
}
export interface DeletedFeed {
    "at:deleted-entry": DeletedEntry;
}
export interface DeletedEntry {
    link: string;
    [XML_FEED_ATTRIBUTES]: {
        ref: string;
        when: string;
    };
    "at:by"?: Author;
}
