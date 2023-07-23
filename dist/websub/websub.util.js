"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPostMessage = void 0;
const crypto_1 = require("crypto");
function verifyPostMessage(body, secret, hubSignature, link) {
    if (!link || !hubSignature || typeof hubSignature !== "string")
        return { valid: false, status: 400 };
    if (!hubSignature)
        return { valid: false, status: 403 };
    const [algo, signature] = hubSignature.split("=");
    try {
        const computedSignature = (0, crypto_1.createHmac)(algo, secret)
            .update(Buffer.from(body, "utf-8"))
            .digest("hex");
        if (signature !== computedSignature)
            return { valid: false, status: 204 };
        return { valid: true, status: 200 };
    }
    catch {
        return { valid: false, status: 403 };
    }
}
exports.verifyPostMessage = verifyPostMessage;
