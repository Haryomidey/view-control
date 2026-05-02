import mongoose from 'mongoose';

export type BannerTone = 'neutral' | 'success' | 'warning' | 'critical';
export type BannerPosition = 'top' | 'bottom';

export interface IBanner {
  ownerId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  message: string;
  tone: BannerTone;
  position: BannerPosition;
  pathPattern: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const bannerSchema = new mongoose.Schema<IBanner>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    tone: {
      type: String,
      enum: ['neutral', 'success', 'warning', 'critical'],
      default: 'neutral',
    },
    position: {
      type: String,
      enum: ['top', 'bottom'],
      default: 'top',
    },
    pathPattern: {
      type: String,
      default: '*',
      trim: true,
      maxlength: 300,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

bannerSchema.index({ projectId: 1, isActive: 1 });

export const Banner = mongoose.model<IBanner>('Banner', bannerSchema);