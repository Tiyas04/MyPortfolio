import mongoose, { Document, Schema } from "mongoose";

export interface Experience extends Document {
    role: string;
    jobtitle: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description: string;
}

const ExperienceSchema: Schema<Experience> = new Schema(
    {
        role: {
            type: String,
            enum:["Full-time","Part-time","Contract","Internship","Freelance","Other"],
            trim: true,
            index: true,
            required: true
        },
        jobtitle: {
            type: String,
            trim: true,
            index: true,
            required: true
        },
        company: {
            type: String,
            trim: true,
            index: true,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
        },
        description: {
            type: String,
            trim: true,
            index: true,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const ExperienceModel = (mongoose.models.Experience as mongoose.Model<Experience>) || mongoose.model<Experience>("Experience",ExperienceSchema)

export default ExperienceModel