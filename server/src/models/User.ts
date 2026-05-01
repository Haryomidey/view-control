import mongoose from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: 'owner' | 'member';
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'owner',
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', userSchema);
