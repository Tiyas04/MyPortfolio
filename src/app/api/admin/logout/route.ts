import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );

        // Clear the admin_session cookie
        response.cookies.set("admin_session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/"
        });

        return response;
    } catch (error: any) {
        console.error("Logout route error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
