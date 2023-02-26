// GENERATED FROM EXAMPLE DATA USING QUICKTYPE.IO
export interface YouTubeFeed {
    "?xml": string;
    feed: Feed;
}

export interface Feed {
    link: string[] | string;
    id: string;
    "yt:channelId": string;
    title: string;
    author: Author;
    published: string;
    entry: Entry[];
    "yt:playlistId"?: string;
}

export interface Author {
    name: string;
    uri: string;
}

export interface Entry {
    id: string;
    "yt:videoId": string;
    "yt:channelId": string;
    title: string;
    link: string;
    author: Author;
    published: string;
    updated: string;
    "media:group": MediaGroup;
}

export interface MediaGroup {
    "media:title": string;
    "media:content": string;
    "media:thumbnail": string;
    "media:description": string;
    "media:community": MediaCommunity;
}

export interface MediaCommunity {
    "media:starRating": string;
    "media:statistics": string;
}
