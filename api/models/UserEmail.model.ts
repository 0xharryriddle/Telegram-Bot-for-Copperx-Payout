import mongoose, { Document, Schema } from 'mongoose';

export interface IUserEmail extends Document {
  telegramId: number;
  email: string;
  sid?: string;
  token?: string;
  isAuthenticated: boolean;
  organizationId?: string;
  lastOtpRequestTime?: Date;
  lastLoginTime?: Date;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserEmailSchema = new Schema<IUserEmail>(
  {
    telegramId: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
    isDefault: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// Create a compound unique index on telegramId and email
UserEmailSchema.index({ telegramId: 1, email: 1 }, { unique: true });

// Create an index on email for faster lookups
UserEmailSchema.index({ email: 1 });

export const UserEmailModel = mongoose.model<IUserEmail>('UserEmail', UserEmailSchema); 