import { createHmac, timingSafeEqual } from "node:crypto";

// Server-only. A short-lived, signed note saying "this guest may answer for
// these group-mates". It lets the follow-up server actions skip repeating the
// guest and group lookups, without trusting ids sent by the browser.

const TTL_MS = 15 * 60 * 1000;

export type GroupTokenPayload = { guestId: string; mateIds: string[] };

function sign(data: string, secret: string): string {
    return createHmac("sha256", `group-token:${secret}`).update(data).digest("base64url");
}

export function createGroupToken(payload: GroupTokenPayload, secret: string, now = Date.now()): string {
    const data = Buffer.from(JSON.stringify({ ...payload, exp: now + TTL_MS })).toString("base64url");

    return `${data}.${sign(data, secret)}`;
}

export function verifyGroupToken(token: unknown, secret: string, now = Date.now()): GroupTokenPayload | null {
    if (typeof token !== "string") return null;

    const [data, signature, extra] = token.split(".");
    if (!data || !signature || extra !== undefined) return null;

    const expected = Buffer.from(sign(data, secret));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

    try {
        const { guestId, mateIds, exp } = JSON.parse(Buffer.from(data, "base64url").toString());

        if (typeof exp !== "number" || exp < now) return null;
        if (typeof guestId !== "string" || !Array.isArray(mateIds)) return null;
        if (!mateIds.every((id) => typeof id === "string")) return null;

        return { guestId, mateIds };
    } catch {
        return null;
    }
}
