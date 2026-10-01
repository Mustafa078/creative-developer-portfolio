import mongoose, { Schema } from 'mongoose';

export interface IExperience {
  id: string;
  role: string;
  company: string;
  location?: string;
  type?: string;
  period?: string;
  isCurrent?: boolean;
  description: string;
  technologies?: string[];
  order?: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    type: { type: String, default: 'Full-time' },
    period: { type: String, default: '' },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: '' },
    technologies: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ExperienceModel: mongoose.Model<IExperience> =
  (mongoose.models.Experience as mongoose.Model<IExperience>) ||
  mongoose.model<IExperience>('Experience', ExperienceSchema);
