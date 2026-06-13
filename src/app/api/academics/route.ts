import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import AcademicsModel from "@/models/academics";

export async function POST(request: NextRequest) {
	await dbConnect();

	try {
		const formData = await request.formData();
		const AcademicsMap = new Map<number, any>();

		// Parse formData into an array of objects
		for (const [key, value] of formData.entries()) {
			const match = key.match(/^academics\[(\d+)\]\[(\w+)\]$/);
			if (match) {
				const index = parseInt(match[1]);
				const field = match[2];
				if (!AcademicsMap.has(index)) {
					AcademicsMap.set(index, {});
				}
				AcademicsMap.get(index)[field] = value;
			}
		}

		const AcademicsToProcess = Array.from(AcademicsMap.values());

		if (AcademicsToProcess.length === 0) {
			return NextResponse.json(
				{
					success: false,
					message: "No academics data found"
				},
				{
					status: 400
				}
			);
		}

		// Create all academics
		let createdAcademics = [];
		for (const academicData of AcademicsToProcess) {
			const { school, degree, startDate, endDate, grade } = academicData;

			if (!school || !degree || !startDate || !grade) {
				return NextResponse.json(
					{
						success: false,
						message: "school, degree, startDate, and grade are required"
					},
					{
						status: 400
					}
				);
			}

			const existingAcademic = await AcademicsModel.findOne({ school, degree, startDate });
			if (existingAcademic) {
				return NextResponse.json(
					{
						success: false,
						message: "Academic record already exists"
					},
					{
						status: 409
					}
				);
			}

			const newAcademic = new AcademicsModel({
				school,
				degree,
				startDate,
				endDate,
				grade
			});
			await newAcademic.save();
			createdAcademics.push(newAcademic);
		}

		return NextResponse.json(
			{
				success: true,
				message: "Academics uploaded successfully",
				data: createdAcademics
			},
			{
				status: 200
			}
		);
	} catch (error) {
		console.log("Error occurred", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to upload academics. Internal error occurred"
			},
			{
				status: 500
			}
		);
	}
}

export async function GET() {
    await dbConnect()

    try {
        const academics = await AcademicsModel.find().sort({ startDate: -1 });

        return NextResponse.json(
            {
                success: true,
                message: "Academics retrieved successfully",
                data: academics
            },
            {
                status: 200
            }
         );
    } catch (error) {
        console.log("Error occurred", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to upload academics. Internal error occurred"
			},
			{
				status: 500
			}
		);
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

        const academic = await AcademicsModel.findById(id);
        if (!academic) {
            return NextResponse.json(
                { success: false, message: "Academic record not found" },
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

        if (data.school !== undefined) academic.school = data.school;
        if (data.degree !== undefined) academic.degree = data.degree;
        if (data.grade !== undefined) academic.grade = data.grade;
        if (data.startDate !== undefined) academic.startDate = new Date(data.startDate);
        if (data.endDate !== undefined) {
            academic.endDate = (data.endDate === "Present" || !data.endDate) ? undefined : new Date(data.endDate);
        }

        await academic.save();

        return NextResponse.json(
            {
                success: true,
                message: "Academic record updated successfully",
                data: academic
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Internal error updating academic record", error);
        return NextResponse.json(
            { success: false, message: "Internal error updating academic record" },
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

        const deletedAcademic = await AcademicsModel.findByIdAndDelete(id);
        if (!deletedAcademic) {
            return NextResponse.json(
                { success: false, message: "Academic record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Academic record deleted successfully",
                data: deletedAcademic
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Internal error deleting academic record", error);
        return NextResponse.json(
            { success: false, message: "Internal error deleting academic record" },
            { status: 500 }
        );
    }
}