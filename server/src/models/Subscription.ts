import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  parentId: mongoose.Types.ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: 'free' | 'pro' | 'family' | 'school';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodEnd?: Date;
  childSlots: number;
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  stripeCustomerId: { type: String, required: true },
  stripeSubscriptionId: { type: String },
  plan: { type: String, enum: ['free', 'pro', 'family', 'school'], default: 'free' },
  status: { type: String, enum: ['active', 'cancelled', 'past_due', 'trialing', 'incomplete'], default: 'active' },
  currentPeriodEnd: { type: Date },
  childSlots: { type: Number, default: 1 },
  trialEndsAt: { type: Date },
}, { timestamps: true });

// parentId index is already created by { unique: true } on the field
SubscriptionSchema.index({ stripeCustomerId: 1 });

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
