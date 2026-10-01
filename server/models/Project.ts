import mongoose, { Schema } from 'mongoose';

export interface IProject {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  tags: string[];
  year: string;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  metrics?: Array<{ label: string; value: string }>;
  keyFeatures?: string[];
  order?: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    tags: [{ type: String }],
    year: { type: String, default: new Date().getFullYear().toString() },
    featured: { type: Boolean, default: false },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    metrics: [
      {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
      },
    ],
    keyFeatures: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProjectModel: mongoose.Model<IProject> =
  (mongoose.models.Project as mongoose.Model<IProject>) ||
  mongoose.model<IProject>('Project', ProjectSchema);
