import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectFiles {
  html?: string;
  css?: string;
  js?: string;
  python?: string;
}

export interface IProject extends Document {
  childId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  language: 'html' | 'python';
  files: IProjectFiles;
  thumbnailUrl?: string;
  isPublic: boolean;
  shareSlug?: string;
  viewCount: number;
  missionRef?: { worldId: number; missionId: number };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  childId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  language: { type: String, enum: ['html', 'python'], default: 'html' },
  files: {
    html: { type: String, default: '' },
    css: { type: String, default: '' },
    js: { type: String, default: '' },
    python: { type: String, default: '' },
  },
  thumbnailUrl: { type: String },
  isPublic: { type: Boolean, default: false },
  shareSlug: { type: String, unique: true, sparse: true },
  viewCount: { type: Number, default: 0 },
  missionRef: {
    worldId: { type: Number },
    missionId: { type: Number }
  },
}, { timestamps: true });

ProjectSchema.index({ childId: 1, updatedAt: -1 });
// shareSlug index is already created by { unique: true, sparse: true } on the field
ProjectSchema.index({ isPublic: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
