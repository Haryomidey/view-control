import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
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

export const Project = mongoose.model('Project', projectSchema);
