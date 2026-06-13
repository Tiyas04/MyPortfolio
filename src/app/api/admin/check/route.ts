import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("admin_session")?.value;

        if (!token) {
            return NextResponse.json({ success: true, authenticated: false });
        }

        const payload = verifyToken(token);

        if (!payload || !payload.admin) {
            return NextResponse.json({ success: true, authenticated: false });
        }

        return NextResponse.json({ success: true, authenticated: true });
    } catch (error: any) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { success: false, authenticated: false },
            { status: 500 }
        );
    }
}
