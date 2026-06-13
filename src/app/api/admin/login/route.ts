import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (!password || password !== adminPassword) {
            return NextResponse.json(
                { success: false, message: "Invalid password key" },
                { status: 401 }
            );
        }

        // Token expires in 24 hours
        const exp = Date.now() + 24 * 60 * 60 * 1000;
        const token = signToken({ admin: true, exp });

        const response = NextResponse.json(
            { success: true, message: "Logged in successfully" },
            { status: 200 }
        );

        // Set secure HttpOnly cookie
        response.cookies.set("admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/"
        });

        return response;
    } catch (error: any) {
        console.error("Login route error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
