import dbConnect from "@/lib/dbConnect";
import streamUpload from "@/lib/uploadOnCloudinary";
import ExtracurricularModel from "@/models/extracurricular";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const formData = await request.formData();
        const ExtracurricularsMap = new Map<number, any>();

        // Parse formData into an array of objects
        for (const [key, value] of formData.entries()) {
            const match = key.match(/^extracurriculars\[(\d+)\]\[(\w+)\]$/);

            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                if (!ExtracurricularsMap.has(index)) {
                    ExtracurricularsMap.set(index, {});
                }
                ExtracurricularsMap.get(index)[field] = value;
            }
        }

        const ExtracurricularsToProcess = Array.from(ExtracurricularsMap.values());

        if (ExtracurricularsToProcess.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No extracurriculars data found"
                },
                {
                    status: 400
                }
            );
        }

        // Create all Extracurriculars
        let createdExtracurriculars = [];
        for (const ExtracurricularData of ExtracurricularsToProcess) {
            const { role, organization, description, startDate, endDate, image: imageFile } = ExtracurricularData;

            if (!role || !organization || !description || !startDate || !imageFile) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "role, organization, description, startDate and image are required"
                    },
                    {
                        status: 400
                    }
                );
            }

            const existingExtracurricular = await ExtracurricularModel.findOne({ role, organization });

            if (existingExtracurricular) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Extracurricular as '${role}' at '${organization}' already exists`
                    },
                    { status: 400 }
                );
            }

            let imageUrl = "";
            //upload image on cloudinary
            if (imageFile && imageFile instanceof File) {
                const arrayBuffer = await imageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const uploadResult = await streamUpload(buffer);
                imageUrl = uploadResult.secure_url;
            }

            const newExtracurricular = new ExtracurricularModel({
                role,
                organization,
                description,
                startDate,
                endDate,
                imageUrl: imageUrl,
            })

            await newExtracurricular.save();
            createdExtracurriculars.push(newExtracurricular);
        }


        return Response.json(
            {
                success: true,
                message: `${createdExtracurriculars.length} extracurriculars added successfully`,
                data: createdExtracurriculars
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Internal error", error)

        return NextResponse.json(
            {
                success: false,
                message: "Internal error"
            },
            {
                status: 500
            }
        )
    }
}

export async function GET() {
    await dbConnect()

    try {
        const extracurriculars = await ExtracurricularModel.find()

        return NextResponse.json(
            {
                success: true,
                message: "Extracurriculars fetched successfully",
                data: extracurriculars
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Internal error", error)

        return NextResponse.json(
            {
                success: false,
                message: "Internal error"
            },
            {
                status: 500
            }
        )
    }
}

export async function PATCH(request: NextRequest) {
    await dbConnect()

    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID parameter is required" },
                { status: 400 }
            );
        }

        const extracurricular = await ExtracurricularModel.findById(id);
        if (!extracurricular) {
            return NextResponse.json(
                { success: false, message: "Extracurricular not found" },
                { status: 404 }
            );
        }

        const contentType = request.headers.get("content-type") || "";
        let data: any = {};
        let newImageUrl = "";

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            for (const [key, value] of formData.entries()) {
                if (key === "image" && value instanceof File) {
                    const arrayBuffer = await value.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const uploadResult = await streamUpload(buffer);
                    newImageUrl = uploadResult.secure_url;
                } else {
                    data[key] = value;
                }
            }
        } else {
            data = await request.json();
        }

        if (data.role !== undefined) extracurricular.role = data.role;
        if (data.organization !== undefined) extracurricular.organization = data.organization;
        if (data.description !== undefined) extracurricular.description = data.description;
        if (data.startDate !== undefined) extracurricular.startDate = new Date(data.startDate);
        if (data.endDate !== undefined) {
            extracurricular.endDate = (data.endDate === "Present" || !data.endDate) ? undefined : new Date(data.endDate);
        }
        if (newImageUrl) {
            extracurricular.imageUrl = newImageUrl;
        } else if (data.imageUrl !== undefined) {
            extracurricular.imageUrl = data.imageUrl;
        }

        await extracurricular.save();

        return NextResponse.json(
            {
                success: true,
                message: "Extracurricular updated successfully",
                data: extracurricular
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Internal error updating extracurricular", error);
        return NextResponse.json(
            { success: false, message: "Internal error updating extracurricular" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    await dbConnect()

    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID parameter is required" },
                { status: 400 }
            );
        }

        const deletedExtracurricular = await ExtracurricularModel.findByIdAndDelete(id);
        if (!deletedExtracurricular) {
            return NextResponse.json(
                { success: false, message: "Extracurricular not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Extracurricular deleted successfully",
                data: deletedExtracurricular
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Internal error deleting extracurricular", error);
        return NextResponse.json(
            { success: false, message: "Internal error deleting extracurricular" },
            { status: 500 }
        );
    }
}