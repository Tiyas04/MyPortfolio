import mongoose,{Document,Schema} from "mongoose";

export interface Response extends Document {
    name: string;
    email: string;
    message: string;
}

const ResponseSchema: Schema<Response> = new Schema(
    {
        name: {
            type: String,
            trim: true,
            index: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            index: true,
            required: true
        },
        message: {
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

const ResponseModel = (mongoose.models.Response as mongoose.Model<Response>) || mongoose.model<Response>("Response",ResponseSchema)

export default ResponseModel
