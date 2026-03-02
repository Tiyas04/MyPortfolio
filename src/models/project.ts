import mongoose, { Document, Schema } from "mongoose";

export interface Project extends Document {
    name: string;
    description: string;
    githubUrl:string;
    liveUrl?:string;
    imageUrl:string;
    techstack:string[];
}

const ProjectSchema: Schema<Project> = new Schema(
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
        githubUrl: {
            type: String,
            trim: true,
            required: true
        },
        liveUrl: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
            required: true
        },
        techstack:[{
            type: String,
            trim: true,
            required: true
        }]
    },
    {
        timestamps: true
    }
)

const ProjectModel = (mongoose.models.Project as mongoose.Model<Project>) || mongoose.model<Project>("Project",ProjectSchema)

export default ProjectModel