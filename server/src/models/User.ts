import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'parent' | 'child';
  googleId?: string;
  refreshToken?: string;
  isVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['parent', 'child'], required: true },
  googleId: { type: String, sparse: true },
  refreshToken: { type: String },
  isVerified: { type: Boolean, default: false },
  lastLoginAt: { type: Date },
}, { timestamps: true });

// email index is already created by { unique: true } on the field
// googleId index is already created by { sparse: true } on the field

export default mongoose.model<IUser>('User', UserSchema);
