import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initialProfile, initialProjects, initialSkills, initialExperience, initialServices } from './seedData.js';
import { ProfileModel } from './models/Profile.js';
import { ProjectModel } from './models/Project.js';
import { SkillModel } from './models/Skill.js';
import { ExperienceModel } from './models/Experience.js';
import { ContactMessageModel } from './models/ContactMessage.js';
import { AdminUserModel } from './models/AdminUser.js';
import { generateSalt, hashPassword } from './auth.js';

dotenv.config();

let isMongoConnected = false;
let lastConnectionError: string | null = null;

const initialAdminSalt = generateSalt();
const initialAdminHash = hashPassword('admin123', initialAdminSalt);

// In-memory fallback database stores
export const memoryStore = {
  profile: { ...initialProfile },
  projects: [...initialProjects],
  skills: [...initialSkills],
  experience: [...initialExperience],
  services: [...initialServices],
  admin: {
    email: 'admin@portfolio.com',
    passwordHash: initialAdminHash,
    salt: initialAdminSalt,
  },
  contactMessages: [] as Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>,
};

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('[Database] Notice: No MONGODB_URI provided in environment. Running in memory-backed mode.');
    lastConnectionError = 'No MONGODB_URI environment variable detected.';
    return false;
  }

  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isMongoConnected = true;
    lastConnectionError = null;
    console.log('[Database] Connected to MongoDB database successfully.');

    // Seed MongoDB if empty
    await seedMongoIfEmpty();
    return true;
  } catch (err: any) {
    lastConnectionError = err.message || 'Unknown connection error';
    console.warn(`[Database] MongoDB connection attempt failed: ${lastConnectionError}. Operating in in-memory mode.`);
    isMongoConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isMongoConnected && mongoose.connection.readyState === 1;
}

export function getDbDiagnostics() {
  const mongoUri = process.env.MONGODB_URI;
  let maskedUri: string | null = null;
  if (mongoUri) {
    try {
      maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    } catch {
      maskedUri = 'Configured';
    }
  }

  return {
    isMongo: isDbConnected(),
    database: isDbConnected() ? 'MongoDB (Connected)' : 'In-Memory (Fallback)',
    mongoUriConfigured: Boolean(mongoUri && mongoUri.trim().length > 0),
    maskedUri,
    lastError: lastConnectionError,
  };
}

export async function seedMongoIfEmpty() {
  if (!isDbConnected()) return;
  try {
    const profileCount = await ProfileModel.countDocuments();
    if (profileCount === 0) {
      console.log('[Database] Seeding initial profile into MongoDB...');
      await ProfileModel.create(initialProfile as any);
    }

    const projectCount = await ProjectModel.countDocuments();
    if (projectCount === 0) {
      console.log('[Database] Seeding initial projects into MongoDB...');
      await ProjectModel.insertMany(initialProjects as any[]);
    }

    const skillCount = await SkillModel.countDocuments();
    if (skillCount === 0) {
      console.log('[Database] Seeding initial skills into MongoDB...');
      await SkillModel.insertMany(initialSkills as any[]);
    }

    const expCount = await ExperienceModel.countDocuments();
    if (expCount === 0) {
      console.log('[Database] Seeding initial experience into MongoDB...');
      await ExperienceModel.insertMany(initialExperience as any[]);
    }

    const adminCount = await AdminUserModel.countDocuments();
    if (adminCount === 0) {
      console.log('[Database] Seeding initial admin credentials into MongoDB...');
      await AdminUserModel.create({
        email: memoryStore.admin.email,
        passwordHash: memoryStore.admin.passwordHash,
        salt: memoryStore.admin.salt,
      });
    }
  } catch (err) {
    console.error('[Database] Error while seeding MongoDB:', err);
  }
}

export async function resetDatabaseToDefaults() {
  // Reset in-memory store
  memoryStore.profile = { ...initialProfile };
  memoryStore.projects = [...initialProjects];
  memoryStore.skills = [...initialSkills];
  memoryStore.experience = [...initialExperience];
  memoryStore.services = [...initialServices];
  memoryStore.contactMessages = [];

  // Reset MongoDB if connected
  if (isDbConnected()) {
    try {
      await ProfileModel.deleteMany({});
      await ProfileModel.create(initialProfile as any);

      await ProjectModel.deleteMany({});
      await ProjectModel.insertMany(initialProjects as any[]);

      await SkillModel.deleteMany({});
      await SkillModel.insertMany(initialSkills as any[]);

      await ExperienceModel.deleteMany({});
      await ExperienceModel.insertMany(initialExperience as any[]);

      await ContactMessageModel.deleteMany({});
    } catch (err) {
      console.error('[Database] Failed resetting MongoDB collections:', err);
    }
  }
}
