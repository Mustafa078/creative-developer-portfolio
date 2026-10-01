import mongoose, { Schema } from 'mongoose';

export interface IProfile {
  name: string;
  greeting: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  status: string;
  avatar: string;
  resumeUrl: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: string;
    handle: string;
  }>;
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true, default: 'Alex Rivera' },
    greeting: { type: String, required: true, default: "Hi, I'm Alex Rivera" },
    titlePrefix: { type: String, default: 'Creative Developer Building' },
    titleHighlight: { type: String, default: 'Digital' },
    titleSuffix: { type: String, default: 'Experiences' },
    tagline: { type: String, default: '' },
    bio: { type: String, default: '' },
    email: { type: String, required: true, default: 'alex.rivera@example.com' },
    location: { type: String, default: 'San Francisco, CA / Remote' },
    status: { type: String, default: 'Available for work' },
    avatar: { type: String, default: '' },
    resumeUrl: { type: String, default: '#' },
    socialLinks: [
      {
        platform: { type: String, default: '' },
        url: { type: String, default: '' },
        icon: { type: String, default: '' },
        handle: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

export const ProfileModel: mongoose.Model<IProfile> =
  (mongoose.models.Profile as mongoose.Model<IProfile>) ||
  mongoose.model<IProfile>('Profile', ProfileSchema);
