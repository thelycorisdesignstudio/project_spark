// ---------------------------------------------------------------------------
// Flow-state detection for SPARK coding sessions
// ---------------------------------------------------------------------------
// "Flow" = the child is deeply focused and productive.  When detected the
// platform should get out of the way: suppress gamification chrome, buddy
// nudges, and time-limit pop-ups so the child can keep building.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FlowIndicators {
  /** Number of meaningful code edits in the last minute */
  codeChangesPerMinute: number;
  /** Number of AI buddy messages sent by the child per minute */
  aiMessagesPerMinute: number;
  /** Errors (compile / runtime) per minute */
  errorFrequency: number;
  /** How long the current session has been running */
  sessionLengthMinutes: number;
  /** Fraction of recent code-run attempts that succeeded (0-1) */
  successRate: number;
}

export interface FlowStateActions {
  /** Collapse XP bar, badge toast, level ring etc. */
  hideGamification: boolean;
  /** Do not send proactive buddy messages */
  suppressBuddyNudges: boolean;
  /** Skip the "time's almost up" modal */
  disableTimeLimitWarnings: boolean;
}

export interface FlowSessionSummary {
  wasInFlow: boolean;
  flowDurationMinutes: number;
  peakCodingRate: number;
  stagesCompleted: number;
  xpEarned: number;
}

// ---------------------------------------------------------------------------
// Thresholds (tunable)
// ---------------------------------------------------------------------------

const FLOW_MIN_CODE_CHANGES = 30;        // changes / min
const FLOW_MAX_AI_MESSAGES = 0.5;         // messages / min
const FLOW_MAX_ERROR_FREQ = 1.5;          // errors / min
const FLOW_MIN_SUCCESS_RATE = 0.6;        // 60 % of runs succeed

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

/**
 * Determine whether the child is currently in a flow state based on
 * real-time session indicators.
 *
 * All four criteria must be satisfied simultaneously:
 * 1. Active coding:  >= 30 code changes per minute
 * 2. Self-reliant:   < 0.5 AI buddy messages per minute
 * 3. Manageable errors: < 1.5 errors per minute
 * 4. Making progress:   success rate > 60 %
 */
export function isInFlowState(indicators: FlowIndicators): boolean {
  return (
    indicators.codeChangesPerMinute >= FLOW_MIN_CODE_CHANGES &&
    indicators.aiMessagesPerMinute < FLOW_MAX_AI_MESSAGES &&
    indicators.errorFrequency < FLOW_MAX_ERROR_FREQ &&
    indicators.successRate > FLOW_MIN_SUCCESS_RATE
  );
}

/**
 * Returns the set of UI behaviour modifications that should be applied
 * while the child is in a flow state.  All flags are true — meaning
 * "yes, do suppress / hide this element."
 */
export function getFlowStateActions(): FlowStateActions {
  return {
    hideGamification: true,
    suppressBuddyNudges: true,
    disableTimeLimitWarnings: true,
  };
}

// ---------------------------------------------------------------------------
// Post-session summary
// ---------------------------------------------------------------------------

/**
 * After a session ends, build a summary that highlights whether the child
 * entered flow, how long it lasted, and what they accomplished.
 *
 * @param samples   Array of FlowIndicators snapshots taken during the session
 *                  (e.g. one per minute).
 * @param sessionMinutes  Total session length.
 * @param xpEarned  XP earned during the session.
 * @param stagesCompleted  Number of curriculum stages completed.
 */
export function buildFlowSummary(
  samples: FlowIndicators[],
  sessionMinutes: number,
  xpEarned: number,
  stagesCompleted: number,
): FlowSessionSummary {
  if (samples.length === 0) {
    return {
      wasInFlow: false,
      flowDurationMinutes: 0,
      peakCodingRate: 0,
      stagesCompleted,
      xpEarned,
    };
  }

  let flowMinutes = 0;
  let peakCodingRate = 0;

  for (const sample of samples) {
    if (isInFlowState(sample)) {
      // Each sample represents roughly 1 minute of activity.
      // If the caller supplies samples at a different cadence, the
      // duration estimate scales proportionally.
      flowMinutes += sessionMinutes / samples.length;
    }
    if (sample.codeChangesPerMinute > peakCodingRate) {
      peakCodingRate = sample.codeChangesPerMinute;
    }
  }

  // Round to one decimal place for readability
  flowMinutes = Math.round(flowMinutes * 10) / 10;

  return {
    wasInFlow: flowMinutes > 0,
    flowDurationMinutes: flowMinutes,
    peakCodingRate,
    stagesCompleted,
    xpEarned,
  };
}
