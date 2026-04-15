import mongoose, { Document, Schema } from "mongoose";

export interface Academics extends Document {
    school: string;
    degree: string;
    startDate: Date;
    endDate?: Date;
    grade: string;
}

const AcademicsSchema: Schema<Academics> = new Schema(
    {
        school: {
            type: String,
            trim: true,
            index: true,
            required: true
        },
        degree: {
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
        grade: {
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

const AcademicsModel = (mongoose.models.Academics as mongoose.Model<Academics>) || mongoose.model<Academics>("Academics",AcademicsSchema)

export default AcademicsModel