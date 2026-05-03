import mongoose from 'mongoose';
import Progress from '../models/Progress';

// ---------------------------------------------------------------------------
// Dynamic Difficulty Adjustment (DDA)
// ---------------------------------------------------------------------------

export interface DifficultyMetrics {
  /** Average number of hints used per stage (across recent window) */
  avgHintsPerStage: number;
  /** Average number of attempts per stage */
  avgAttemptsPerStage: number;
  /** Average time spent per stage in seconds */
  avgTimePerStage: number;
  /** Fraction of recent stages that were failed or required multiple attempts (0-1) */
  recentErrorRate: number;
  /** Frustration score (0-100) from the frustration detector */
  frustrationScore: number;
}

export type DifficultyMode = 'too-easy' | 'optimal' | 'too-hard' | 'struggling';

// ---------------------------------------------------------------------------
// Thresholds (derived from play-testing benchmarks for kids 8-16)
// ---------------------------------------------------------------------------

/** Weighted contribution of each metric to the composite difficulty score */
const WEIGHTS = {
  hints: 0.30,
  attempts: 0.25,
  errors: 0.25,
  frustration: 0.20,
} as const;

/**
 * Normalize a raw metric to a 0-1 scale, where 0 means "trivially easy" and
 * 1 means "extremely hard / struggling".
 *
 * Each normalizer maps a raw value to [0, 1] via a simple linear clamp.
 */
function normalizeHints(avg: number): number {
  // 0 hints -> 0, 3+ hints -> 1
  return Math.min(1, Math.max(0, avg / 3));
}

function normalizeAttempts(avg: number): number {
  // 1 attempt -> 0, 5+ attempts -> 1
  return Math.min(1, Math.max(0, (avg - 1) / 4));
}

function normalizeErrors(rate: number): number {
  // rate already 0-1
  return Math.min(1, Math.max(0, rate));
}

function normalizeFrustration(score: number): number {
  // score 0-100 -> 0-1
  return Math.min(1, Math.max(0, score / 100));
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

/**
 * Produce a single composite score in [0, 1] from the metrics, then classify
 * into one of four difficulty modes.
 *
 * Composite score interpretation:
 *   0.00 – 0.20  => too-easy      (student breezes through without challenge)
 *   0.20 – 0.55  => optimal       (productive struggle zone)
 *   0.55 – 0.75  => too-hard      (student needs lighter scaffolding)
 *   0.75 – 1.00  => struggling    (intervention / encouragement needed)
 */
export function classifyDifficulty(metrics: DifficultyMetrics): DifficultyMode {
  const composite =
    WEIGHTS.hints * normalizeHints(metrics.avgHintsPerStage) +
    WEIGHTS.attempts * normalizeAttempts(metrics.avgAttemptsPerStage) +
    WEIGHTS.errors * normalizeErrors(metrics.recentErrorRate) +
    WEIGHTS.frustration * normalizeFrustration(metrics.frustrationScore);

  if (composite < 0.20) return 'too-easy';
  if (composite < 0.55) return 'optimal';
  if (composite < 0.75) return 'too-hard';
  return 'struggling';
}

// ---------------------------------------------------------------------------
// AI prompt instructions per mode
// ---------------------------------------------------------------------------

/**
 * Return detailed AI prompt instructions that should be injected into the
 * tutoring LLM system prompt to adapt its behaviour to the learner's current
 * difficulty mode.
 */
export function getDDAInstructions(mode: DifficultyMode): string {
  switch (mode) {
    case 'too-easy':
      return [
        'The learner is breezing through the current material with minimal effort.',
        'Challenge them more to keep engagement high:',
        '- Introduce bonus challenges or stretch goals beyond the base task.',
        '- Reduce the amount of scaffolding and let them figure out more independently.',
        '- Ask open-ended questions like "Can you think of another way to do this?"',
        '- Encourage experimentation: "What happens if you change X?"',
        '- Praise effort and creativity rather than just correctness.',
        '- Suggest they help explain the concept as if teaching a friend.',
        '- Skip overly detailed explanations — use concise hints instead.',
      ].join('\n');

    case 'optimal':
      return [
        'The learner is in the productive struggle zone — the ideal learning state.',
        'Maintain the current pace and level of support:',
        '- Provide hints only when the learner explicitly asks or after a reasonable pause.',
        '- Use Socratic questioning to guide them toward the answer.',
        '- Celebrate small wins and correct steps along the way.',
        '- Offer just enough context so they can connect the dots themselves.',
        '- Keep explanations concise but complete.',
        '- If they make a mistake, highlight what was correct before addressing the error.',
        '- Encourage them to read error messages and debug before giving the solution.',
      ].join('\n');

    case 'too-hard':
      return [
        'The learner is finding the current material too difficult.',
        'Provide more scaffolding and break tasks into smaller steps:',
        '- Break the current task into bite-sized sub-tasks and tackle one at a time.',
        '- Give more explicit examples before asking them to try on their own.',
        '- Use analogies and relatable comparisons to explain concepts.',
        '- Proactively offer hints rather than waiting for the learner to ask.',
        '- Show partial code with blanks they can fill in (fill-in-the-gap).',
        '- Reduce the complexity of the expected output.',
        '- Revisit prerequisite concepts briefly if there are gaps.',
        '- Use encouraging language: "This is a tricky one — let\'s work through it together."',
      ].join('\n');

    case 'struggling':
      return [
        'The learner is struggling significantly and may be frustrated or disengaged.',
        'Switch to maximum support and emotional encouragement:',
        '- Prioritize emotional support: "It\'s totally okay to find this hard — you\'re doing great by trying!"',
        '- Provide the most guided version of the task (e.g., fill in one small blank).',
        '- Offer to walk through a fully worked example first, then let them try a similar one.',
        '- Use extremely short, simple sentences and avoid jargon.',
        '- Celebrate every small step, even partial progress.',
        '- Suggest a quick fun break or a creative mini-activity to reset mood.',
        '- If they have been stuck for multiple attempts, give the answer and explain why it works.',
        '- Consider suggesting they revisit an earlier easier mission to rebuild confidence.',
        '- Never use negative language about their performance.',
      ].join('\n');
  }
}

// ---------------------------------------------------------------------------
// Compute metrics from the database
// ---------------------------------------------------------------------------

/** Number of recent completed stages to analyse */
const RECENT_STAGE_WINDOW = 5;

/**
 * Query the Progress collection for a child's most recent completed stages
 * and compute DifficultyMetrics.
 *
 * If the child has no completed stages yet, returns zeroed-out metrics which
 * will classify as 'too-easy' (so the system starts at baseline difficulty).
 */
export async function computeDDAMetrics(
  childId: string | mongoose.Types.ObjectId,
): Promise<DifficultyMetrics> {
  const recentStages = await Progress.find({
    childId,
    status: 'completed',
  })
    .sort({ updatedAt: -1 })
    .limit(RECENT_STAGE_WINDOW)
    .lean();

  // Default metrics when no data is available
  if (recentStages.length === 0) {
    return {
      avgHintsPerStage: 0,
      avgAttemptsPerStage: 1,
      avgTimePerStage: 0,
      recentErrorRate: 0,
      frustrationScore: 0,
    };
  }

  const count = recentStages.length;

  const totalHints = recentStages.reduce((sum, s) => sum + (s.hintsUsed ?? 0), 0);
  const totalAttempts = recentStages.reduce((sum, s) => sum + (s.attempts ?? 1), 0);
  const totalTime = recentStages.reduce((sum, s) => sum + (s.timeSpentSeconds ?? 0), 0);

  // Error rate: fraction of stages that required more than 1 attempt
  const stagesWithErrors = recentStages.filter((s) => (s.attempts ?? 1) > 1).length;
  const recentErrorRate = stagesWithErrors / count;

  // Frustration heuristic based solely on Progress data (hint layers & attempts)
  // Full frustration scoring lives in frustrationDetector.ts; here we produce a
  // lightweight proxy so DDA metrics can be computed without chat messages.
  const avgHintLayer =
    recentStages.reduce((sum, s) => sum + (s.hintLayer ?? 0), 0) / count;
  const frustrationProxy = Math.min(
    100,
    avgHintLayer * 20 +             // 0-3 layers -> 0-60
    recentErrorRate * 30 +          // 0-1 -> 0-30
    (totalHints / count > 2 ? 10 : 0), // bonus if heavy hint use
  );

  return {
    avgHintsPerStage: totalHints / count,
    avgAttemptsPerStage: totalAttempts / count,
    avgTimePerStage: totalTime / count,
    recentErrorRate,
    frustrationScore: frustrationProxy,
  };
}
