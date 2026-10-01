import mongoose, { Schema } from 'mongoose';

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
  read?: boolean;
  createdAt?: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactMessageModel: mongoose.Model<IContactMessage> =
  (mongoose.models.ContactMessage as mongoose.Model<IContactMessage>) ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
