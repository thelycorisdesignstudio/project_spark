// ---------------------------------------------------------------------------
// Frustration Detector
// ---------------------------------------------------------------------------
// Analyses recent chat messages, error streaks, timing, and hint usage to
// produce a frustration score (0-100) that feeds into the DDA system.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Keyword list
// ---------------------------------------------------------------------------

/**
 * Words and phrases that signal frustration, confusion, or disengagement
 * in a child's chat messages. Checked case-insensitively.
 */
export const FRUSTRATION_KEYWORDS: readonly string[] = [
  // Direct frustration
  'i hate this',
  'this is stupid',
  'this is dumb',
  'i can\'t do this',
  'i cant do this',
  'i give up',
  'i quit',
  'too hard',
  'impossible',
  'makes no sense',
  'don\'t understand',
  'dont understand',
  'don\'t get it',
  'dont get it',
  'confused',
  'confusing',
  // Anger / annoyance
  'ugh',
  'argh',
  'grr',
  'stop',
  'why won\'t this work',
  'why wont this work',
  'not working',
  'broken',
  'nothing works',
  // Helplessness
  'help me',
  'please help',
  'what do i do',
  'i\'m stuck',
  'im stuck',
  'stuck',
  'lost',
  'no idea',
  'idk',
  // Boredom / disengagement
  'boring',
  'bored',
  'this sucks',
  'whatever',
  'i don\'t care',
  'i dont care',
] as const;

// ---------------------------------------------------------------------------
// Signals interface
// ---------------------------------------------------------------------------

export interface FrustrationSignals {
  /** Lengths (in characters) of the learner's recent messages */
  messageLengths: number[];
  /** Keywords detected in recent messages (lowercased, may contain duplicates) */
  keywordsDetected: string[];
  /** Number of consecutive incorrect attempts without a success */
  consecutiveErrors: number;
  /** Seconds elapsed since the learner last completed a stage successfully */
  timeSinceLastSuccess: number;
  /** Highest hint layer reached in the current stage (0 = no hints, 3 = max) */
  hintLayerReached: number;
}

// ---------------------------------------------------------------------------
// Scoring weights & helpers
// ---------------------------------------------------------------------------

/**
 * Compute a frustration score from 0 (calm) to 100 (highly frustrated).
 *
 * Scoring breakdown (approximate max contributions):
 *   - Keyword density            0-30 pts
 *   - Message length anomalies   0-15 pts  (very short messages signal disengagement)
 *   - Consecutive errors         0-25 pts
 *   - Time since last success    0-15 pts
 *   - Hint layer reached         0-15 pts
 */
export function computeFrustrationScore(signals: FrustrationSignals): number {
  let score = 0;

  // ---- 1. Keyword density (0-30) ----
  const keywordCount = signals.keywordsDetected.length;
  // Each keyword adds up to 10 points, capped at 30
  score += Math.min(30, keywordCount * 10);

  // ---- 2. Message length anomalies (0-15) ----
  if (signals.messageLengths.length > 0) {
    const avgLength =
      signals.messageLengths.reduce((a, b) => a + b, 0) /
      signals.messageLengths.length;

    // Very short average messages (< 10 chars) suggest button-mashing or
    // terse frustrated responses.  Longer messages are neutral.
    if (avgLength < 5) {
      score += 15;
    } else if (avgLength < 10) {
      score += 10;
    } else if (avgLength < 20) {
      score += 5;
    }
    // else: normal or long messages -> 0 extra points
  }

  // ---- 3. Consecutive errors (0-25) ----
  // Each consecutive error adds 5 points, capped at 25
  score += Math.min(25, signals.consecutiveErrors * 5);

  // ---- 4. Time since last success (0-15) ----
  // A long gap since the last successful completion suggests the learner is
  // stuck.  Thresholds: >10 min -> 15, >5 min -> 10, >2 min -> 5
  const minutesSinceSuccess = signals.timeSinceLastSuccess / 60;
  if (minutesSinceSuccess > 10) {
    score += 15;
  } else if (minutesSinceSuccess > 5) {
    score += 10;
  } else if (minutesSinceSuccess > 2) {
    score += 5;
  }

  // ---- 5. Hint layer reached (0-15) ----
  // Each hint layer adds 5 points (max layer 3 -> 15)
  score += Math.min(15, signals.hintLayerReached * 5);

  // Clamp to [0, 100]
  return Math.min(100, Math.max(0, score));
}

// ---------------------------------------------------------------------------
// Build signals from raw inputs
// ---------------------------------------------------------------------------

/**
 * Construct a FrustrationSignals object from raw conversation and progress
 * data.
 *
 * @param recentMessages  Array of the learner's recent chat message strings.
 * @param consecutiveErrors  Number of consecutive incorrect attempts.
 * @param timeSinceLastSuccess  Seconds since the last successfully completed stage.
 * @param hintLayer  Current hint layer reached (0-3).
 */
export function buildFrustrationSignals(
  recentMessages: string[],
  consecutiveErrors: number,
  timeSinceLastSuccess: number,
  hintLayer: number,
): FrustrationSignals {
  const messageLengths = recentMessages.map((msg) => msg.length);

  // Detect frustration keywords across all recent messages
  const keywordsDetected: string[] = [];
  const lowerMessages = recentMessages.map((m) => m.toLowerCase());

  for (const keyword of FRUSTRATION_KEYWORDS) {
    for (const msg of lowerMessages) {
      if (msg.includes(keyword)) {
        keywordsDetected.push(keyword);
        // Only count each keyword once per message scan pass; move to next keyword
        break;
      }
    }
  }

  return {
    messageLengths,
    keywordsDetected,
    consecutiveErrors,
    timeSinceLastSuccess,
    hintLayerReached: hintLayer,
  };
}
