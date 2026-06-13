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

            const experiencePayload: any = {
                role,
                jobtitle,
                company,
                description,
                startDate,
            };

            if (endDate && endDate !== "Present") {
                experiencePayload.endDate = endDate;
            }

            const newExperience = new ExperienceModel(experiencePayload);

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

        const experience = await ExperienceModel.findById(id);
        if (!experience) {
            return NextResponse.json(
                { success: false, message: "Experience not found" },
                { status: 404 }
            );
        }

        const contentType = request.headers.get("content-type") || "";
        let data: any = {};

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
        } else {
            data = await request.json();
        }

        if (data.role !== undefined) experience.role = data.role;
        if (data.jobtitle !== undefined) experience.jobtitle = data.jobtitle;
        if (data.company !== undefined) experience.company = data.company;
        if (data.description !== undefined) experience.description = data.description;
        if (data.startDate !== undefined) experience.startDate = new Date(data.startDate);
        if (data.endDate !== undefined) {
            experience.endDate = (data.endDate === "Present" || !data.endDate) ? undefined : new Date(data.endDate);
        }

        await experience.save();

        return NextResponse.json(
            {
                success: true,
                message: "Experience updated successfully",
                data: experience
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Internal error updating experience", error);
        return NextResponse.json(
            { success: false, message: "Internal error updating experience" },
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

        const deletedExperience = await ExperienceModel.findByIdAndDelete(id);
        if (!deletedExperience) {
            return NextResponse.json(
                { success: false, message: "Experience not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Experience deleted successfully",
                data: deletedExperience
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Internal error deleting experience", error);
        return NextResponse.json(
            { success: false, message: "Internal error deleting experience" },
            { status: 500 }
        );
    }
}