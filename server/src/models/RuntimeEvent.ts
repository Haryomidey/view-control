import mongoose from 'mongoose';

const runtimeEventSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
    projectKey: {
      type: String,
      index: true,
    },
    type: {
      type: String,
      enum: ['load', 'apply', 'error'],
      required: true,
      index: true,
    },
    url: String,
    userAgent: String,
    payload: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

runtimeEventSchema.index({ createdAt: -1 });

export const RuntimeEvent = mongoose.model('RuntimeEvent', runtimeEventSchema);
