import mongoose,{Document,Schema} from "mongoose";

export interface Extracurricular extends Document {
    role: string;
    organization: string;
    description: string;
    imageUrl: string;
    startDate: Date;
    endDate?: Date;
}

const ExtracurricularSchema: Schema<Extracurricular> = new Schema(
    {
        role: {
            type: String,
            trim: true,
            index: true,
            required: true
        },
        organization: {
            type: String,
            trim: true,
            index: true,
            required: true
        },
        description: {
            type: String,
            trim: true,
            index: true,
            required: true
        },
        imageUrl: {
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
        }
    },
    {
        timestamps: true
    }
)

const ExtracurricularModel = (mongoose.models.Extracurricular as mongoose.Model<Extracurricular>) || mongoose.model<Extracurricular>("Extracurricular",ExtracurricularSchema)

export default ExtracurricularModel
