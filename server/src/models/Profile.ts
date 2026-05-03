import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  displayName: string;
  avatarUrl?: string;
  avatarColor: string;
  age?: number;
  pinHash?: string;
  skillLevel: string;
  xp: number;
  level: number;
  streakCount: number;
  streakFreezes: number;
  lastActiveDate?: Date;
  totalTimeSpentMinutes: number;
  dailyTimeLimitMinutes?: number;
  publicSharingEnabled: boolean;
  soundEnabled: boolean;
  skillKnowledgeState: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'User' },
  displayName: { type: String, required: true, trim: true },
  avatarUrl: { type: String },
  avatarColor: { type: String, default: '#0891B2' },
  age: { type: Number, min: 5, max: 18 },
  pinHash: { type: String },
  skillLevel: {
    type: String,
    enum: ['spark-starter', 'code-explorer', 'build-master', 'code-wizard', 'spark-legend'],
    default: 'spark-starter'
  },
  xp: { type: Number, default: 0, min: 0 },
  level: { type: Number, default: 1, min: 1, max: 50 },
  streakCount: { type: Number, default: 0, min: 0 },
  streakFreezes: { type: Number, default: 2, min: 0, max: 10 },
  lastActiveDate: { type: Date },
  totalTimeSpentMinutes: { type: Number, default: 0 },
  dailyTimeLimitMinutes: { type: Number },
  publicSharingEnabled: { type: Boolean, default: false },
  soundEnabled: { type: Boolean, default: true },
  skillKnowledgeState: { type: Map, of: Number, default: {} },
}, { timestamps: true });

ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ parentId: 1 });

export default mongoose.model<IProfile>('Profile', ProfileSchema);
