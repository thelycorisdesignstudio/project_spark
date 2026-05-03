/**
 * Spaced Repetition System (SRS) — SM-2 Algorithm
 *
 * Implements the SuperMemo SM-2 algorithm adapted for SPARK's coding
 * education context.  Each "card" corresponds to a coding skill/concept
 * that the child has encountered.  Review quality is derived from hint
 * usage during missions so the system is automatic — no manual card
 * grading required.
 *
 * SRS state is persisted in a dedicated Mongoose collection so it
 * remains decoupled from the Profile document.
 */

import mongoose, { Schema, Document } from 'mongoose';

// ---------------------------------------------------------------------------
// Mongoose model for SRS card persistence
// ---------------------------------------------------------------------------

export interface ISRSCardDoc extends Document {
  childId: mongoose.Types.ObjectId;
  skillSlug: string;
  interval: number;          // days until next review
  easeFactor: number;        // SM-2 ease factor, range [1.3, 2.5]
  repetitions: number;       // consecutive correct reviews
  nextReviewDate: Date;
  lastReviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SRSCardSchema = new Schema<ISRSCardDoc>(
  {
    childId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    skillSlug: { type: String, required: true, trim: true },
    interval: { type: Number, default: 1 },
    easeFactor: { type: Number, default: 2.5, min: 1.3 },
    repetitions: { type: Number, default: 0 },
    nextReviewDate: { type: Date, required: true },
    lastReviewDate: { type: Date, required: true },
  },
  { timestamps: true },
);

SRSCardSchema.index({ childId: 1, skillSlug: 1 }, { unique: true });
SRSCardSchema.index({ childId: 1, nextReviewDate: 1 });

export const SRSCardModel = mongoose.models['SRSCard'] as mongoose.Model<ISRSCardDoc>
  ?? mongoose.model<ISRSCardDoc>('SRSCard', SRSCardSchema);

// ---------------------------------------------------------------------------
// Plain SRSCard interface (used for in-memory computation)
// ---------------------------------------------------------------------------

export interface SRSCard {
  skillSlug: string;
  interval: number;          // days
  easeFactor: number;        // 1.3 – 2.5
  repetitions: number;
  nextReviewDate: Date;
}

// ---------------------------------------------------------------------------
// SM-2 core
// ---------------------------------------------------------------------------

/**
 * Update an SRS card using the SM-2 algorithm.
 *
 * Quality scale (0-5):
 *   5 — perfect response
 *   4 — correct after hesitation
 *   3 — correct with difficulty
 *   2 — incorrect but easy recall of correct answer
 *   1 — incorrect; correct answer remembered
 *   0 — complete blackout
 *
 * When quality >= 3 the card is promoted; otherwise it resets to the
 * beginning of the learning phase but the ease factor is still updated.
 *
 * @param card    Current card state
 * @param quality Review quality 0-5
 * @returns       New card state (pure — does not mutate input)
 */
export function updateSRS(card: SRSCard, quality: number): SRSCard {
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  // --- Ease factor update (always applied) ---
  // SM-2 formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let newEF =
    card.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  newEF = Math.max(1.3, Math.min(2.5, newEF));

  let newInterval: number;
  let newRepetitions: number;

  if (q >= 3) {
    // Successful recall
    newRepetitions = card.repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(card.interval * newEF);
    }
  } else {
    // Failed recall — restart learning phase
    newRepetitions = 0;
    newInterval = 1;
  }

  const now = new Date();
  const nextReview = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    skillSlug: card.skillSlug,
    interval: newInterval,
    easeFactor: newEF,
    repetitions: newRepetitions,
    nextReviewDate: nextReview,
  };
}

// ---------------------------------------------------------------------------
// Hint-to-quality mapping
// ---------------------------------------------------------------------------

/**
 * Convert the number of hints a child used during a mission stage into
 * an SM-2 quality score.
 *
 *   0 hints -> 5 (perfect)
 *   1 hint  -> 4 (slight hesitation)
 *   2 hints -> 2 (incorrect recall level — needs review)
 *   3+ hints -> 1 (poor recall)
 */
export function hintUsageToQuality(hintsUsed: number): number {
  switch (Math.min(hintsUsed, 3)) {
    case 0:
      return 5;
    case 1:
      return 4;
    case 2:
      return 2;
    case 3:
    default:
      return 1;
  }
}

// ---------------------------------------------------------------------------
// Database helpers
// ---------------------------------------------------------------------------

/**
 * Retrieve all SRS cards for a child that are due for review (i.e. their
 * nextReviewDate is at or before the current moment).
 *
 * @param childId  Profile ObjectId as string
 * @returns        Array of due SRSCard objects
 */
export async function getDueReviewCards(childId: string): Promise<SRSCard[]> {
  const now = new Date();

  const docs = await SRSCardModel.find({
    childId,
    nextReviewDate: { $lte: now },
  })
    .sort({ nextReviewDate: 1 })
    .lean()
    .exec();

  return docs.map((doc) => ({
    skillSlug: doc.skillSlug,
    interval: doc.interval,
    easeFactor: doc.easeFactor,
    repetitions: doc.repetitions,
    nextReviewDate: doc.nextReviewDate,
  }));
}

/**
 * Create or update an SRS card for a child after they complete a mission
 * stage.  If no card exists for the skill yet, a new one is created.
 *
 * @param childId   Profile ObjectId as string
 * @param skillSlug The skill/concept identifier
 * @param quality   SM-2 quality 0-5
 * @returns         The updated SRSCard
 */
export async function recordReview(
  childId: string,
  skillSlug: string,
  quality: number,
): Promise<SRSCard> {
  const now = new Date();

  const existing = await SRSCardModel.findOne({ childId, skillSlug }).exec();

  let card: SRSCard;

  if (existing) {
    card = {
      skillSlug: existing.skillSlug,
      interval: existing.interval,
      easeFactor: existing.easeFactor,
      repetitions: existing.repetitions,
      nextReviewDate: existing.nextReviewDate,
    };
  } else {
    // Brand-new card — first encounter
    card = {
      skillSlug,
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: now,
    };
  }

  const updated = updateSRS(card, quality);

  await SRSCardModel.findOneAndUpdate(
    { childId, skillSlug },
    {
      $set: {
        interval: updated.interval,
        easeFactor: updated.easeFactor,
        repetitions: updated.repetitions,
        nextReviewDate: updated.nextReviewDate,
        lastReviewDate: now,
      },
      $setOnInsert: {
        childId,
        skillSlug,
      },
    },
    { upsert: true, new: true },
  ).exec();

  return updated;
}
