import mongoose from 'mongoose';
import Profile from '../models/Profile';

// ---------------------------------------------------------------------------
// Bayesian Knowledge Tracing (BKT)
// ---------------------------------------------------------------------------

export interface BKTParams {
  /** Probability the skill transitions from unlearned to learned on each opportunity */
  pLearn: number;
  /** Probability a learner slips (answers incorrectly despite knowing the skill) */
  pSlip: number;
  /** Probability a learner guesses correctly despite not knowing the skill */
  pGuess: number;
  /** Current estimated probability the skill is known */
  pKnown: number;
}

/** Mastery threshold — a skill is considered mastered at or above this value */
export const MASTERY_THRESHOLD = 0.95;

// ---------------------------------------------------------------------------
// All curriculum skill slugs
// ---------------------------------------------------------------------------
export const ALL_SKILLS: readonly string[] = [
  'html-structure',
  'html-media',
  'css-basics',
  'css-layout',
  'css-animations',
  'js-variables',
  'js-conditionals',
  'js-loops',
  'js-functions',
  'js-dom',
  'js-events',
  'canvas-basics',
  'canvas-animation',
  'canvas-game-logic',
  'python-basics',
  'python-conditionals',
  'python-loops',
  'python-functions',
  'python-data',
] as const;

// ---------------------------------------------------------------------------
// Default BKT parameters per skill
//
// pLearn  — higher for foundational skills (easier to pick up)
// pSlip   — slightly elevated for skills prone to typo / syntax errors
// pGuess  — low across the board; genuine coding answers are hard to guess
// pKnown  — prior starts at 0.05 (near-zero) for every new learner
// ---------------------------------------------------------------------------
export const DEFAULT_BKT_PARAMS: Record<string, BKTParams> = {
  'html-structure':      { pLearn: 0.20, pSlip: 0.08, pGuess: 0.15, pKnown: 0.05 },
  'html-media':          { pLearn: 0.18, pSlip: 0.08, pGuess: 0.12, pKnown: 0.05 },
  'css-basics':          { pLearn: 0.18, pSlip: 0.10, pGuess: 0.12, pKnown: 0.05 },
  'css-layout':          { pLearn: 0.15, pSlip: 0.10, pGuess: 0.10, pKnown: 0.05 },
  'css-animations':      { pLearn: 0.12, pSlip: 0.12, pGuess: 0.08, pKnown: 0.05 },
  'js-variables':        { pLearn: 0.20, pSlip: 0.10, pGuess: 0.12, pKnown: 0.05 },
  'js-conditionals':     { pLearn: 0.15, pSlip: 0.10, pGuess: 0.10, pKnown: 0.05 },
  'js-loops':            { pLearn: 0.14, pSlip: 0.12, pGuess: 0.08, pKnown: 0.05 },
  'js-functions':        { pLearn: 0.12, pSlip: 0.12, pGuess: 0.08, pKnown: 0.05 },
  'js-dom':              { pLearn: 0.12, pSlip: 0.10, pGuess: 0.08, pKnown: 0.05 },
  'js-events':           { pLearn: 0.12, pSlip: 0.10, pGuess: 0.08, pKnown: 0.05 },
  'canvas-basics':       { pLearn: 0.15, pSlip: 0.10, pGuess: 0.10, pKnown: 0.05 },
  'canvas-animation':    { pLearn: 0.12, pSlip: 0.12, pGuess: 0.08, pKnown: 0.05 },
  'canvas-game-logic':   { pLearn: 0.10, pSlip: 0.12, pGuess: 0.06, pKnown: 0.05 },
  'python-basics':       { pLearn: 0.20, pSlip: 0.08, pGuess: 0.12, pKnown: 0.05 },
  'python-conditionals': { pLearn: 0.15, pSlip: 0.10, pGuess: 0.10, pKnown: 0.05 },
  'python-loops':        { pLearn: 0.14, pSlip: 0.12, pGuess: 0.08, pKnown: 0.05 },
  'python-functions':    { pLearn: 0.12, pSlip: 0.12, pGuess: 0.08, pKnown: 0.05 },
  'python-data':         { pLearn: 0.10, pSlip: 0.12, pGuess: 0.06, pKnown: 0.05 },
};

// ---------------------------------------------------------------------------
// Core BKT update  (Bayes' theorem)
// ---------------------------------------------------------------------------

/**
 * Given current BKT parameters and an observation (correct / incorrect),
 * return a new BKTParams with updated pKnown.
 *
 * Uses the standard two-step BKT update:
 *   1. **Posterior** — update pKnown based on the observation via Bayes' rule.
 *   2. **Learning** — account for the chance the student learned during the
 *      opportunity (transition from unlearned -> learned).
 */
export function updateBKT(params: BKTParams, correct: boolean): BKTParams {
  const { pLearn, pSlip, pGuess, pKnown } = params;

  // ------ Step 1: posterior via Bayes' theorem ------
  let pKnownPosterior: number;

  if (correct) {
    // P(known | correct) = P(correct|known)*P(known) / P(correct)
    const pCorrectIfKnown = 1 - pSlip;
    const pCorrect = pKnownPosterior =
      pCorrectIfKnown * pKnown + pGuess * (1 - pKnown);
    pKnownPosterior = (pCorrectIfKnown * pKnown) / pCorrect;
  } else {
    // P(known | incorrect) = P(incorrect|known)*P(known) / P(incorrect)
    const pIncorrectIfKnown = pSlip;
    const pIncorrect =
      pIncorrectIfKnown * pKnown + (1 - pGuess) * (1 - pKnown);
    pKnownPosterior = (pIncorrectIfKnown * pKnown) / pIncorrect;
  }

  // ------ Step 2: learning transition ------
  // P(known_new) = P(known_posterior) + P(learn) * (1 - P(known_posterior))
  const pKnownNew = pKnownPosterior + pLearn * (1 - pKnownPosterior);

  // Clamp to [0, 1] for safety
  const clamped = Math.min(1, Math.max(0, pKnownNew));

  return { pLearn, pSlip, pGuess, pKnown: clamped };
}

// ---------------------------------------------------------------------------
// Database helpers
// ---------------------------------------------------------------------------

/**
 * Retrieve the child's full BKT state from Profile.skillKnowledgeState.
 * For any skill not yet in the map, the default prior (0.05) is used.
 *
 * Returns a Map<skillSlug, pKnown>.
 */
export async function getChildBKTState(
  childId: string | mongoose.Types.ObjectId,
): Promise<Map<string, number>> {
  const profile = await Profile.findOne({ userId: childId }).lean();

  const state = new Map<string, number>();

  // Seed every skill with its default prior
  for (const skill of ALL_SKILLS) {
    state.set(skill, DEFAULT_BKT_PARAMS[skill].pKnown);
  }

  // Overlay persisted values
  if (profile?.skillKnowledgeState) {
    const persisted =
      profile.skillKnowledgeState instanceof Map
        ? profile.skillKnowledgeState
        : new Map<string, number>(Object.entries(profile.skillKnowledgeState as Record<string, number>));

    for (const [skill, pKnown] of persisted) {
      if (ALL_SKILLS.includes(skill)) {
        state.set(skill, pKnown);
      }
    }
  }

  return state;
}

/**
 * Perform one BKT update for a child on a single skill and persist the new
 * pKnown to Profile.skillKnowledgeState.
 *
 * Returns the updated BKTParams.
 */
export async function updateChildSkill(
  childId: string | mongoose.Types.ObjectId,
  skillSlug: string,
  correct: boolean,
): Promise<BKTParams> {
  // Fetch current pKnown
  const profile = await Profile.findOne({ userId: childId });
  if (!profile) {
    throw new Error(`Profile not found for childId: ${childId}`);
  }

  const currentPKnown =
    profile.skillKnowledgeState.get(skillSlug) ??
    DEFAULT_BKT_PARAMS[skillSlug]?.pKnown ??
    0.05;

  const defaults = DEFAULT_BKT_PARAMS[skillSlug] ?? {
    pLearn: 0.15,
    pSlip: 0.10,
    pGuess: 0.10,
    pKnown: currentPKnown,
  };

  const currentParams: BKTParams = { ...defaults, pKnown: currentPKnown };
  const updated = updateBKT(currentParams, correct);

  // Persist
  profile.skillKnowledgeState.set(skillSlug, updated.pKnown);
  await profile.save();

  return updated;
}
