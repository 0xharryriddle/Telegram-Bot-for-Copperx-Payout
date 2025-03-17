import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  telegramId: number;
  email?: string;
  sid?: string;
  token?: string;
  isAuthenticated: boolean;
  organizationId?: string;
  lastOtpRequestTime?: Date;
  lastLoginTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    telegramId: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
    },
    sid: {
      type: String,
    },
    token: {
      type: String,
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    organizationId: {
      type: String,
    },
    lastOtpRequestTime: {
      type: Date,
    },
    lastLoginTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
