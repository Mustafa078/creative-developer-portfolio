import mongoose, { Schema } from 'mongoose';

export interface IAdminUser {
  email: string;
  passwordHash: string;
  salt: string;
  updatedAt?: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, default: 'admin@portfolio.com' },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
  },
  { timestamps: true }
);

export const AdminUserModel: mongoose.Model<IAdminUser> =
  (mongoose.models.AdminUser as mongoose.Model<IAdminUser>) ||
  mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
