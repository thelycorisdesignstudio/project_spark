import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
  childId: mongoose.Types.ObjectId;
  badgeSlug: string;
  earnedAt: Date;
  seen: boolean;
}

const BadgeSchema = new Schema<IBadge>({
  childId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  badgeSlug: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
});

BadgeSchema.index({ childId: 1, badgeSlug: 1 }, { unique: true });
BadgeSchema.index({ childId: 1, seen: 1 });

export default mongoose.model<IBadge>('Badge', BadgeSchema);
