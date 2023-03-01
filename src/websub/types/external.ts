export interface EntryPayload {
    channelId: string;
    channelName: string;
    videoId: string;
    title: string;
    published: Date;
    updated: Date;
}

export interface EntryDeletedPayload {
    channelId?: string;
    videoId: string;
    when: Date;
}
