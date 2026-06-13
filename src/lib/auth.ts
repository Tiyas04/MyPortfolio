import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-at-least-32-chars-long-tiyas-portfolio";

export function signToken(payload: object): string {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto
        .createHmac("sha256", JWT_SECRET)
        .update(`${header}.${body}`)
        .digest("base64url");
    return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): any | null {
    try {
        const [header, body, signature] = token.split(".");
        if (!header || !body || !signature) return null;
        
        const expectedSignature = crypto
            .createHmac("sha256", JWT_SECRET)
            .update(`${header}.${body}`)
            .digest("base64url");
            
        if (signature !== expectedSignature) return null;
        
        const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
        // Check expiration
        if (payload.exp && Date.now() > payload.exp) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}
