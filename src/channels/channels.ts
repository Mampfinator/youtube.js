import { err, ok, Result } from "neverthrow";
import { ListResponse, RequireOnlyOne } from "../base-types";
import { YouTubeClient } from "../client";
import { YouTubeEndpoints } from "../endpoints";
import { YouTubeAPIError, YouTubeClientError } from "../errors";
import { mapProperties, toDate } from "../util/util";
import { ChannelResource } from "./types/api-types";
import { Channel, ChannelPart } from "./types/parsed-types";

type ListOptions<TPart extends ChannelPart> = RequireOnlyOne<{
    part: Partial<Record<TPart, true>>;

    hl?: string;
    maxResults?: number;
    pageToken?: string;

    // filters
    categoryId: string;
    forUsername: string;
    ids: string[];
    managedByMe: boolean;
    mine: boolean;
}, "categoryId" | "forUsername" | "ids" | "managedByMe" | "mine">;

type Entry<T extends object> = { [P in keyof T]: [P, T[P]] }[keyof T];

type Entries<T extends object> = Entry<T>[]; 
declare namespace Object {
    function entries<T extends object>(source: T): Entries<T>;
    function fromEntries<T extends object>(entries: Entries<T>): T;
    function keys<T extends object>(source: T): [keyof T, ...(keyof T)[]];
}


type ChannelListResponse = ListResponse<"youtube#channelListResponse", ChannelResource>;

export class ChannelsEndpoints extends YouTubeEndpoints {
    constructor(
        client: YouTubeClient
    ) {
        super(client, "channels", [
            {
                for: "youtube#channel",
                transform(source: ChannelResource): Channel<ChannelPart> {
                    const replacers = {
                        snippet: (raw: ChannelResource["snippet"]) => mapProperties(source.snippet, {publishedAt: toDate}),
                        contentOwnerDetails: (raw: ChannelResource["contentOwnerDetails"]) => mapProperties(source.contentOwnerDetails, {timeLinked: toDate})
                    }

                    const entries: Entries<Channel<ChannelPart>> = Object
                        .entries(source)
                        .map(([key, value]: [any, any]) => [key, (replacers[key as keyof typeof replacers]?.(value) ?? value)]); 


                    return Object.fromEntries(entries);
                }
            }
        ]);
    }

    public async list<TPart extends ChannelPart>(options: ListOptions<TPart>): Promise<Result<Channel<TPart>[], YouTubeAPIError | YouTubeClientError>> {
        const { part, hl, maxResults, pageToken, categoryId, forUsername, ids, managedByMe, mine } = options;

        const result = await this.client.get<ChannelListResponse>("channels", {
            query: {
                part: Object.keys(part ?? {}),
                id: ids?.join(","),
                hl,
                maxResults,
                pageToken,
                categoryId,
                forUsername,
                managedByMe,
                mine,
            }
        });

        if (result.isErr()) return err(result.error);

        const transformed = result.value.items.map(item => this.transform<ChannelResource, Channel<TPart>>(item));
        if (transformed.filter(c => c).length !== transformed.length) return err(new YouTubeClientError());

        return ok(
            transformed as Channel<TPart>[]
        )
    }
}