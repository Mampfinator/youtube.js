import { createHmac } from "crypto";

export function verifyPostMessage(
    body: string,
    secret: string,
    hubSignature: string,
    link: string,
): { valid: boolean; status: number } {
    if (!link || !hubSignature || typeof hubSignature !== "string")
        return { valid: false, status: 400 };

    if (!hubSignature) return { valid: false, status: 403 };
    const [algo, signature] = hubSignature.split("=");
    try {
        const computedSignature = createHmac(algo, secret)
            .update(Buffer.from(body, "utf-8"))
            .digest("hex");

        if (signature !== computedSignature)
            return { valid: false, status: 204 };

        return { valid: true, status: 200 };
    } catch {
        return { valid: false, status: 403 };
    }
}
