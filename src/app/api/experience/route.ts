import dbConnect from "@/lib/dbConnect";
import ExperienceModel from "@/models/experience";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const formData = await request.formData();
        const ExperiencesMap = new Map<number, any>();

        // Parse formData into an array of objects
        for (const [key, value] of formData.entries()) {
            const match = key.match(/^Experiences\[(\d+)\]\[(\w+)\]$/i);

            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                if (!ExperiencesMap.has(index)) {
                    ExperiencesMap.set(index, {});
                }
                ExperiencesMap.get(index)[field] = value;
            }
        }

        const ExperiencesToProcess = Array.from(ExperiencesMap.values());

        if (ExperiencesToProcess.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No experiences data found"
                },
                {
                    status: 400
                }
            );
        }

        // Create all Extracurriculars
        let createdExperiences = [];
        for (const ExperienceData of ExperiencesToProcess) {
            const { role, jobtitle, company, description, startDate, endDate } = ExperienceData;

            if (!role || !jobtitle || !company || !description || !startDate) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "role, jobtitle, company, description, startDate are required"
                    },
                    {
                        status: 400
                    }
                );
            }

            const existingExperience = await ExperienceModel.findOne({ role, company });

            if (existingExperience) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Experience as '${role}' at '${company}' already exists`
                    },
                    { status: 400 }
                );
            }

            const newExperience = new ExperienceModel({
                role,
                jobtitle,
                company,
                description,
                startDate,
                endDate,
            })

            await newExperience.save();
            createdExperiences.push(newExperience);
        }


        return Response.json(
            {
                success: true,
                message: `${createdExperiences.length} experiences added successfully`,
                data: createdExperiences
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
        const experiences = await ExperienceModel.find()

        return NextResponse.json(
            {
                success: true,
                message: "Experiences fetched successfully",
                data: experiences
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