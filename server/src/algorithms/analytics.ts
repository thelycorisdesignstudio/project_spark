import mongoose, { Schema, Document } from 'mongoose';

// ---------------------------------------------------------------------------
// Event type union
// ---------------------------------------------------------------------------

export type AnalyticsEventType =
  | 'session_start'
  | 'session_end'
  | 'code_run'
  | 'code_error'
  | 'code_success'
  | 'stage_attempt'
  | 'stage_complete'
  | 'mission_complete'
  | 'world_complete'
  | 'hint_requested'
  | 'hint_layer_advanced'
  | 'buddy_message_sent'
  | 'buddy_message_received'
  | 'badge_earned'
  | 'level_up'
  | 'daily_challenge_complete'
  | 'streak_extended'
  | 'streak_broken'
  | 'project_saved'
  | 'project_published'
  | 'fatigue_detected'
  | 'flow_detected'
  | 'frustration_detected';

// ---------------------------------------------------------------------------
// Document interface
// ---------------------------------------------------------------------------

export interface IAnalyticsEvent extends Document {
  childId: mongoose.Types.ObjectId;
  eventType: AnalyticsEventType;
  metadata: Record<string, unknown>;
  timestamp: Date;
  sessionId: string;
}

// ---------------------------------------------------------------------------
// Schema & Model
// ---------------------------------------------------------------------------

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    childId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    eventType: {
      type: String,
      required: true,
      enum: [
        'session_start',
        'session_end',
        'code_run',
        'code_error',
        'code_success',
        'stage_attempt',
        'stage_complete',
        'mission_complete',
        'world_complete',
        'hint_requested',
        'hint_layer_advanced',
        'buddy_message_sent',
        'buddy_message_received',
        'badge_earned',
        'level_up',
        'daily_challenge_complete',
        'streak_extended',
        'streak_broken',
        'project_saved',
        'project_published',
        'fatigue_detected',
        'flow_detected',
        'frustration_detected',
      ] satisfies AnalyticsEventType[],
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, required: true },
    sessionId: { type: String, required: true },
  },
  {
    // No updatedAt needed for append-only analytics events
    timestamps: false,
  },
);

// Compound index for efficient per-child, per-event-type time-range queries
AnalyticsEventSchema.index({ childId: 1, eventType: 1, timestamp: -1 });

// Secondary index for session-based lookups
AnalyticsEventSchema.index({ sessionId: 1, timestamp: 1 });

// TTL index: auto-delete documents after 365 days (1 year)
AnalyticsEventSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 365 * 24 * 60 * 60 },
);

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>(
  'AnalyticsEvent',
  AnalyticsEventSchema,
);

// ---------------------------------------------------------------------------
// Write helpers
// ---------------------------------------------------------------------------

/**
 * Record a single analytics event.
 */
export async function trackEvent(
  childId: string,
  eventType: AnalyticsEventType,
  metadata: Record<string, unknown>,
  sessionId: string,
): Promise<void> {
  await AnalyticsEvent.create({
    childId,
    eventType,
    metadata,
    timestamp: new Date(),
    sessionId,
  });
}

/**
 * Bulk-insert multiple analytics events in one round-trip.
 */
export async function trackEvents(
  events: {
    childId: string;
    eventType: AnalyticsEventType;
    metadata: Record<string, unknown>;
    sessionId: string;
  }[],
): Promise<void> {
  if (events.length === 0) return;

  const docs = events.map((e) => ({
    childId: e.childId,
    eventType: e.eventType,
    metadata: e.metadata,
    timestamp: new Date(),
    sessionId: e.sessionId,
  }));

  await AnalyticsEvent.insertMany(docs, { ordered: false });
}

// ---------------------------------------------------------------------------
// Read helpers
// ---------------------------------------------------------------------------

/**
 * Count events of a given type for a child since a specific date.
 */
export async function getEventCounts(
  childId: string,
  eventType: AnalyticsEventType,
  since: Date,
): Promise<number> {
  return AnalyticsEvent.countDocuments({
    childId,
    eventType,
    timestamp: { $gte: since },
  });
}

/**
 * Fetch the N most recent events of a given type for a child.
 */
export async function getRecentEvents(
  childId: string,
  eventType: AnalyticsEventType,
  limit: number = 20,
): Promise<IAnalyticsEvent[]> {
  return AnalyticsEvent.find({ childId, eventType })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean<IAnalyticsEvent[]>();
}
