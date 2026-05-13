import { NextRequest, NextResponse } from "next/server";
import streamUpload from "@/lib/uploadOnCloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();   
        const buffer = Buffer.from(arrayBuffer);
        const result = await streamUpload(buffer);
        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}