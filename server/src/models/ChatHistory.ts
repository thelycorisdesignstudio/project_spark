import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  childId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  buddyEmotion?: string;
  createdAt: Date;
}

const ChatHistorySchema = new Schema<IChatMessage>({
  childId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  sessionId: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  buddyEmotion: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 7776000 },
});

ChatHistorySchema.index({ childId: 1, sessionId: 1, createdAt: -1 });

export default mongoose.model<IChatMessage>('ChatHistory', ChatHistorySchema);
