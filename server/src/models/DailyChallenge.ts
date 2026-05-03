import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyChallenge extends Document {
  date: string;
  title: string;
  brief: string;
  starterCode: { html?: string; css?: string; js?: string; python?: string };
  language: 'html' | 'python';
  xpReward: number;
  badgeSlug?: string;
  completedBy: mongoose.Types.ObjectId[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const DailyChallengeSchema = new Schema<IDailyChallenge>({
  date: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  brief: { type: String, required: true },
  starterCode: {
    html: { type: String },
    css: { type: String },
    js: { type: String },
    python: { type: String },
  },
  language: { type: String, enum: ['html', 'python'], default: 'html' },
  xpReward: { type: Number, default: 100 },
  badgeSlug: { type: String },
  completedBy: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
});

// date index is already created by { unique: true } on the field

export default mongoose.model<IDailyChallenge>('DailyChallenge', DailyChallengeSchema);
