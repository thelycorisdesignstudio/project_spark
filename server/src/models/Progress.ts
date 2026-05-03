import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  childId: mongoose.Types.ObjectId;
  worldId: number;
  missionId: number;
  stageId: number;
  status: 'locked' | 'in-progress' | 'completed';
  hintsUsed: number;
  hintLayer: number;
  timeSpentSeconds: number;
  xpEarned: number;
  attempts: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>({
  childId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  worldId: { type: Number, required: true, min: 1, max: 5 },
  missionId: { type: Number, required: true, min: 1, max: 6 },
  stageId: { type: Number, required: true, min: 1, max: 3 },
  status: { type: String, enum: ['locked', 'in-progress', 'completed'], default: 'locked' },
  hintsUsed: { type: Number, default: 0, min: 0 },
  hintLayer: { type: Number, default: 0 },
  timeSpentSeconds: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  completedAt: { type: Date },
}, { timestamps: true });

ProgressSchema.index({ childId: 1, worldId: 1, missionId: 1, stageId: 1 }, { unique: true });
ProgressSchema.index({ childId: 1, status: 1, updatedAt: -1 });

export default mongoose.model<IProgress>('Progress', ProgressSchema);
