import mongoose, { Schema, Document, Model } from 'mongoose';

// ---------------------------------------------------------------------------
// Inline Mongoose model – PinAttempt
// Tracks brute-force PIN entry attempts per child profile.
// A TTL index on `updatedAt` automatically removes stale records after 1 hour.
// ---------------------------------------------------------------------------

interface IPinAttempt extends Document {
  childId: string;
  attempts: number;
  lockedUntil: Date | null;
  updatedAt: Date;
}

const pinAttemptSchema = new Schema<IPinAttempt>(
  {
    childId: { type: String, required: true, unique: true, index: true },
    attempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
  },
  {
    timestamps: true, // auto-manages createdAt & updatedAt
  }
);

// Auto-expire documents 1 hour after last update
pinAttemptSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 3600 });

// Avoid re-compiling if the model already exists (hot-reload safety)
const PinAttempt: Model<IPinAttempt> =
  mongoose.models.PinAttempt as Model<IPinAttempt> ||
  mongoose.model<IPinAttempt>('PinAttempt', pinAttemptSchema);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Checks whether the child is currently allowed to attempt a PIN entry.
 * Throws an error with a kid-friendly message when locked out.
 * Returns `true` when the attempt is permitted.
 */
export async function checkPinAttempt(childId: string): Promise<boolean> {
  const record = await PinAttempt.findOne({ childId }).lean();

  if (!record) {
    return true; // No prior failures
  }

  if (record.lockedUntil && record.lockedUntil.getTime() > Date.now()) {
    const remainingMs = record.lockedUntil.getTime() - Date.now();
    const remainingMin = Math.ceil(remainingMs / 60_000);
    throw new Error(
      `Too many wrong tries! Please wait ${remainingMin} minute${remainingMin === 1 ? '' : 's'} before trying again.`
    );
  }

  // If the lock has expired, reset so the child gets a fresh set of attempts
  if (record.lockedUntil && record.lockedUntil.getTime() <= Date.now()) {
    await PinAttempt.deleteOne({ childId });
  }

  return true;
}

/**
 * Records a failed PIN attempt. After `MAX_ATTEMPTS` consecutive failures
 * the account is locked for `LOCK_DURATION_MS` milliseconds.
 */
export async function recordFailedPinAttempt(childId: string): Promise<void> {
  const record = await PinAttempt.findOneAndUpdate(
    { childId },
    {
      $inc: { attempts: 1 },
      $set: { updatedAt: new Date() },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (record.attempts >= MAX_ATTEMPTS) {
    await PinAttempt.updateOne(
      { childId },
      { $set: { lockedUntil: new Date(Date.now() + LOCK_DURATION_MS) } }
    );
  }
}

/**
 * Resets (deletes) the attempt record for a child after a successful PIN
 * entry, giving them a clean slate.
 */
export async function resetPinAttempts(childId: string): Promise<void> {
  await PinAttempt.deleteOne({ childId });
}
