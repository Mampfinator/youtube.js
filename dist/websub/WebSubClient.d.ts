/// <reference types="node" />
import { type Request as ExpressRequest, type Response as ExpressResponse } from "express";
import { Result } from "neverthrow";
import { WebSubMessage } from "./types/internal";
import { EntryDeletedPayload, EntryPayload } from "./types/external";
import EventEmitter from "events";
/**
 * Options for the {@link WebSubClient}.
 */
export interface WebSubClientOptions {
    /**
     * Where the client should expect its verification- and messageHandlers.
     */
    callbackUrl: string;
    secret: string;
    /**
     * How long the client should wait for verification before timing out.
     * @default 10000
     */
    timeout?: number;
    /**
     * Whether to automatically renew subscription leases.
     * @default true
     */
    automaticRenewal?: boolean;
}
interface WebSubClientEvents {
    invalidMessage: (request: ExpressRequest) => void;
    verified: (request: ExpressRequest) => void;
    denied: (channelId: string) => void;
    subscribed: (channelId: string) => void;
    unsubscribed: (channelId: string) => void;
    message: (message: WebSubMessage) => void;
    entryDeleted: (payload: EntryDeletedPayload) => void;
    entryAdded: (payload: EntryPayload) => void;
    entryUpdated: (payload: EntryPayload) => void;
    feedModified: (payload: EntryPayload) => void;
    error: (error: any) => void;
}
export declare class WebSubClient extends EventEmitter {
    private readonly timeout;
    private readonly secret;
    private readonly callbackUrl;
    private readonly automaticRenewal;
    private readonly pending;
    /**
     * Map of renewal timers for each channel.
     * Always empty if `automaticRenewal` is false.
     */
    private readonly renewalTimers;
    /**
     * Mount as GET handler on the callback path.
     */
    readonly verificationHandler: (req: ExpressRequest, res: ExpressResponse) => void;
    /**
     * Mount as POST handler on the callback path.
     */
    readonly messageHandler: (req: ExpressRequest, res: ExpressResponse) => void;
    constructor(options: WebSubClientOptions);
    private _doSubscribe;
    /**
     * Emitted when {@linkcode messageHandler} or {@linkcode verificationHandler} receive invalid requests, indicating someone other than the hub is trying to request from that route.
     * @event
     */
    on(eventName: "invalidMessage", listener: WebSubClientEvents["invalidMessage"]): this;
    /**
     * Emitted when the {@linkcode verificationHandler} receives a valid request.
     * @event
     */
    on(eventName: "verified", listener: WebSubClientEvents["verified"]): this;
    /**
     * Emitted when the {@linkcode verificationHandler} receives a `denied` request, indicated that a subscription request to the hub was malformed.
     * @event
     */
    on(eventName: "denied", listener: WebSubClientEvents["denied"]): this;
    /**
     * Emitted when a subscribe request is successful.
     * @event
     */
    on(eventName: "subscribed", listener: WebSubClientEvents["subscribed"]): this;
    /**
     * Emitted when an unsubscribe request is successful.
     * @event
     */
    on(eventName: "unsubscribed", listener: WebSubClientEvents["unsubscribed"]): this;
    /**
     * Emitted whenever the client receives a valid notification.
     * @event
     */
    on(eventName: "message", listener: WebSubClientEvents["message"]): this;
    /**
     * Emitted when a channel has deleted a video.
     * @event
     */
    on(eventName: "entryDeleted", listener: WebSubClientEvents["entryDeleted"]): this;
    /**
     * Emitted when a channel has added a video (this can be a reservation, an upload, etc.)
     * @event
     */
    on(eventName: "entryAdded", listener: WebSubClientEvents["entryAdded"]): this;
    /**
     * Emitted when a channel has updated an already existing video.
     * @event
     */
    on(eventName: "entryUpdated", listener: WebSubClientEvents["entryUpdated"]): this;
    /**
     * Emitted alongside `entryAdded` and `entryUpdated` as a catch-all event.
     * @event
     */
    on(eventName: "feedModified", listener: WebSubClientEvents["feedModified"]): this;
    /**
     * Emitted when an unexpected `Error` is thrown.
     * @event
     */
    on(eventName: "error", listener: WebSubClientEvents["error"]): this;
    subscribe(channelId: string): Promise<Result<void, Error>>;
    unsubscribe(channelId: string): Promise<Result<void, Error>>;
}
export {};
