import dbConnect from "@/lib/dbConnect";
import streamUpload from "@/lib/uploadOnCloudinary";
import { NextRequest, NextResponse } from "next/server";
import SkillModel from "@/models/skill";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const formData = await request.formData();
        const SkillsMap = new Map<number, any>();

        // Parse formData into an array of objects
        for (const [key, value] of formData.entries()) {
            const match = key.match(/^skills\[(\d+)\]\[(\w+)\]$/);

            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];

                if (!SkillsMap.has(index)) {
                    SkillsMap.set(index, {});
                }
                SkillsMap.get(index)[field] = value;
            }
        }

        const SkillsToProcess = Array.from(SkillsMap.values());

        if (SkillsToProcess.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No skills data found"
                },
                {
                    status: 400
                }
            );
        }

        // Create all skills
        let createdSkills = [];
        for (const skillData of SkillsToProcess) {
            const { name, image: imageFile, description } = skillData;

            if (!name || !description || !imageFile) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "All fields are required"
                    },
                    {
                        status: 400
                    }
                );
            }

            const existingSkill = await SkillModel.findOne({ name });

            if (existingSkill) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Skill with name '${name}' already exists`
                    },
                    {
                        status: 400
                    }
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

            const newSkill = new SkillModel({
                name,
                imageUrl: imageUrl,
                description
            })

            await newSkill.save();
            createdSkills.push(newSkill);
        }


        return Response.json(
            {
                success: true,
                message: `${createdSkills.length} skills added successfully`,
                data: createdSkills
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error occurred" + error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to add skill.Internal error occurred"
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
        const skills = await SkillModel.find();
        return NextResponse.json(
            {
                success: true,
                message: "Skills fetched successfully",
                data: skills
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error occurred" + error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to get skills.Internal error occurred"
            },
            {
                status: 500
            }
        )
    }
}
