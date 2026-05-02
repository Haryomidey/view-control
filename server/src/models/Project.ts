import mongoose from 'mongoose';

export interface IProject {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  domain: string;
  allowedDomains: string[];
  projectKey: string;
  status: 'connected' | 'pending' | 'disabled';
  lastSeenAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    allowedDomains: {
      type: [String],
      default: [],
    },
    projectKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['connected', 'pending', 'disabled'],
      default: 'pending',
      index: true,
    },
    lastSeenAt: Date,
  },
  { timestamps: true },
);

projectSchema.index({ ownerId: 1, domain: 1 }, { unique: true });

export const Project = mongoose.model<IProject>('Project', projectSchema);