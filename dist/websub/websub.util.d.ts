export declare function verifyPostMessage(body: string, secret: string, hubSignature: string, link: string): {
    valid: boolean;
    status: number;
};
