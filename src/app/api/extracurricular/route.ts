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

            const existingExtracurricular = await ExtracurricularModel.findOne({ name });

            if (existingExtracurricular) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Extracurricular with name '${name}' already exists`
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