import mongoose, { Schema } from 'mongoose';

export interface ISkill {
  id: string;
  name: string;
  level: number;
  category?: string;
  icon?: string;
  color?: string;
  experience?: string;
  order?: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100, default: 80 },
    category: { type: String, default: 'frontend' },
    icon: { type: String, default: 'Code' },
    color: { type: String, default: 'from-blue-600 to-indigo-600' },
    experience: { type: String, default: '3+ years' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SkillModel: mongoose.Model<ISkill> =
  (mongoose.models.Skill as mongoose.Model<ISkill>) ||
  mongoose.model<ISkill>('Skill', SkillSchema);
