import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import ResponseModel from "@/models/response";

export async function POST(request:NextRequest){
    await dbConnect()

    try {
        const {name,email,message} = await request.json()

        if([name,email,message].includes(null)){
            return NextResponse.json(
                {
                    success:false,
                    message:"All fields are required"
                },
                {
                    status:400
                }
            )
        }

        const newResponse = new ResponseModel(
            {
                name,
                email,
                message
            }
        )

        await newResponse.save()

        return NextResponse.json(
            {
                success:true,
                message:"Response saved successfully",
                data:newResponse
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.log("Error occurred" + error)
        return NextResponse.json(
            {
                success:false,
                message:"Failed to send response.Internal error occurred"
            },
            {
                status:500
            }
        )
    }
}

export async function GET(){
    await dbConnect()

    try {
        const responses = await ResponseModel.find()
        return NextResponse.json(
            {
                success:true,
                message:"Responses fetched successfully",
                data:responses
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.log("Error occurred" + error)
        return NextResponse.json(
            {
                success:false,
                message:"Failed to get responses.Internal error occurred"
            },
            {
                status:500
            }
        )
    }
}