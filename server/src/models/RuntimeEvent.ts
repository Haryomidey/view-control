import mongoose from 'mongoose';

export interface IRuntimeEvent {
  projectId?: mongoose.Types.ObjectId;
  projectKey?: string;
  type: 'load' | 'apply' | 'error';
  url?: string;
  userAgent?: string;
  payload?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}

const runtimeEventSchema = new mongoose.Schema<IRuntimeEvent>(
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

export const RuntimeEvent = mongoose.model<IRuntimeEvent>('RuntimeEvent', runtimeEventSchema);