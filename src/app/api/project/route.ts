import dbConnect from "@/lib/dbConnect";
import streamUpload from "@/lib/uploadOnCloudinary";
import ProjectModel from "@/models/project";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const formData = await request.formData();
        const ProjectsMap = new Map<number, any>();

        // Parse formData into an array of objects
        for (const [key, value] of formData.entries()) {
            const match = key.match(/^projects\[(\d+)\]\[(\w+)\]$/);

            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];

                if (!ProjectsMap.has(index)) {
                    ProjectsMap.set(index, {});
                }
                ProjectsMap.get(index)[field] = value;
            }
        }

        const ProjectsToProcess = Array.from(ProjectsMap.values());

        if (ProjectsToProcess.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No projects data found"
                },
                {
                    status: 400
                }
            );
        }

        // Create all projects
        let createdProjects = [];
        for (const ProjectData of ProjectsToProcess) {
            const { name, description, githubUrl, liveUrl, image: imageFile, techstack } = ProjectData;

            if (!name || !description || !githubUrl || !techstack) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Name, description, githubUrl, and techstack are required"
                    },
                    {
                        status: 400
                    }
                );
            }

            const existingProject = await ProjectModel.findOne({ name });

            if (existingProject) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Project with name '${name}' already exists`
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

            // Ensure techstack is an array
            const techstackArray = typeof techstack === 'string'
                ? techstack.split(',').map((t: string) => t.trim())
                : Array.isArray(techstack) ? techstack : [techstack];

            const newProject = new ProjectModel({
                name,
                imageUrl,
                description,
                githubUrl,
                liveUrl,
                techstack: techstackArray
            })

            await newProject.save();
            createdProjects.push(newProject);
        }


        return Response.json(
            {
                success: true,
                message: `${createdProjects.length} projects added successfully`,
                data: createdProjects
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
        const projects = await ProjectModel.find()

        return NextResponse.json(
            {
                success: true,
                message: "Projects fetched successfully",
                data: projects
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

        const project = await ProjectModel.findById(id);
        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
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

        if (data.name !== undefined) project.name = data.name;
        if (data.description !== undefined) project.description = data.description;
        if (data.githubUrl !== undefined) project.githubUrl = data.githubUrl;
        if (data.liveUrl !== undefined) project.liveUrl = data.liveUrl;
        if (newImageUrl) {
            project.imageUrl = newImageUrl;
        } else if (data.imageUrl !== undefined) {
            project.imageUrl = data.imageUrl;
        }

        if (data.techstack !== undefined) {
            project.techstack = typeof data.techstack === "string"
                ? data.techstack.split(",").map((t: string) => t.trim())
                : Array.isArray(data.techstack) ? data.techstack : [data.techstack];
        }

        await project.save();

        return NextResponse.json(
            {
                success: true,
                message: "Project updated successfully",
                data: project
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Internal error updating project", error);
        return NextResponse.json(
            { success: false, message: "Internal error updating project" },
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

        const deletedProject = await ProjectModel.findByIdAndDelete(id);
        if (!deletedProject) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Project deleted successfully",
                data: deletedProject
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Internal error deleting project", error);
        return NextResponse.json(
            { success: false, message: "Internal error deleting project" },
            { status: 500 }
        );
    }
}