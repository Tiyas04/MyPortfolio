import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyJwtEdge(token: string, secret: string): Promise<boolean> {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return false;
        const [header, payload, signature] = parts;

        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );

        const base64UrlDecode = (str: string) => {
            let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
            while (base64.length % 4) base64 += "=";
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes;
        };

        const sigBytes = base64UrlDecode(signature);
        const dataBytes = encoder.encode(`${header}.${payload}`);

        const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, dataBytes);
        if (!isValid) return false;

        const decodedPayload = JSON.parse(
            new TextDecoder().decode(base64UrlDecode(payload))
        );

        if (decodedPayload.exp && Date.now() > decodedPayload.exp) {
            return false;
        }

        return !!decodedPayload.admin;
    } catch (err) {
        console.error("JWT verification in proxy failed:", err);
        return false;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isUploadPage = pathname.startsWith("/admin") ||
                         pathname.startsWith("/uploadAcademics") ||
                         pathname.startsWith("/uploadAssets") ||
                         pathname.startsWith("/uploadExperiences") ||
                         pathname.startsWith("/uploadExtracurricular") ||
                         pathname.startsWith("/uploadProjects") ||
                         pathname.startsWith("/uploadSkills");

    const isProtectedApi = pathname.startsWith("/api/academics") ||
                           pathname.startsWith("/api/experience") ||
                           pathname.startsWith("/api/extracurricular") ||
                           pathname.startsWith("/api/project") ||
                           pathname.startsWith("/api/skill") ||
                           pathname.startsWith("/api/upload");

    if (isUploadPage || isProtectedApi) {
        // If it is a protected API and it is a safe GET request, proceed
        if (isProtectedApi && request.method === "GET") {
            return NextResponse.next();
        }

        const token = request.cookies.get("admin_session")?.value;
        const jwtSecret = process.env.JWT_SECRET || "fallback-secret-at-least-32-chars-long-tiyas-portfolio";

        const isAuthenticated = token ? await verifyJwtEdge(token, jwtSecret) : false;

        if (!isAuthenticated) {
            if (isUploadPage) {
                const loginUrl = new URL("/login", request.url);
                loginUrl.searchParams.set("redirect", pathname);
                return NextResponse.redirect(loginUrl);
            } else {
                return new NextResponse(
                    JSON.stringify({ success: false, message: "Unauthorized: Administrative session required" }),
                    { status: 401, headers: { "Content-Type": "application/json" } }
                );
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/uploadAcademics/:path*",
        "/uploadAssets/:path*",
        "/uploadExperiences/:path*",
        "/uploadExtracurricular/:path*",
        "/uploadProjects/:path*",
        "/uploadSkills/:path*",
        "/api/academics/:path*",
        "/api/experience/:path*",
        "/api/extracurricular/:path*",
        "/api/project/:path*",
        "/api/skill/:path*",
        "/api/upload/:path*",
    ]
};
