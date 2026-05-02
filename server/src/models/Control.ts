import mongoose from 'mongoose';

export type ControlAction = 'hide' | 'show' | 'text' | 'replace' | 'html' | 'opacity' | 'display' | 'class' | 'style';

export interface IControl {
  ownerId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  name: string;
  selector: string;
  pathPattern: string;
  action: ControlAction;
  value?: unknown;
  priority: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const controlSchema = new mongoose.Schema<IControl>(
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
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    selector: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    pathPattern: {
      type: String,
      default: '*',
      trim: true,
      maxlength: 300,
    },
    action: {
      type: String,
      enum: ['hide', 'show', 'text', 'replace', 'html', 'opacity', 'display', 'class', 'style'],
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    priority: {
      type: Number,
      default: 100,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

controlSchema.index({ projectId: 1, isActive: 1, priority: 1 });

export const Control = mongoose.model<IControl>('Control', controlSchema);