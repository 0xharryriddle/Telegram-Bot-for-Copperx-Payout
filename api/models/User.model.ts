import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
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
    username: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
