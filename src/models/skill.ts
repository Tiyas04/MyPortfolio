import mongoose,{Document,Schema} from "mongoose";

export interface Skill extends Document {
    name: string;
    description: string;
    imageUrl: string;
}

const SkillSchema: Schema<Skill> = new Schema(
    {
        name: {
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
        }
    },
    {
        timestamps: true
    }
)

const SkillModel = (mongoose.models.Skill as mongoose.Model<Skill>) || mongoose.model<Skill>("Skill",SkillSchema)

export default SkillModel
