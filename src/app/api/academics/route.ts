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
