import { MASTERY_THRESHOLD } from './bkt';

// ---------------------------------------------------------------------------
// Skill Prerequisite Graph
// ---------------------------------------------------------------------------

/**
 * Directed prerequisite graph.
 * Key = skill slug, Value = array of prerequisite skill slugs that must be
 * mastered before the key skill is unlockable.
 *
 * An empty array means the skill has no prerequisites (entry-point skill).
 */
export const SKILL_GRAPH: Record<string, string[]> = {
  // ---- World 1 – HTML & CSS Foundations ----
  'html-structure':      [],                                     // entry point
  'html-media':          ['html-structure'],
  'css-basics':          ['html-structure'],
  'css-layout':          ['css-basics'],
  'css-animations':      ['css-layout'],

  // ---- World 2 – JavaScript Fundamentals ----
  'js-variables':        ['html-structure'],                     // entry into JS after basic HTML
  'js-conditionals':     ['js-variables'],
  'js-loops':            ['js-conditionals'],
  'js-functions':        ['js-loops'],

  // ---- World 3 – JS & the DOM ----
  'js-dom':              ['js-functions', 'css-basics'],         // needs both JS fundamentals & CSS
  'js-events':           ['js-dom'],

  // ---- World 4 – Canvas & Game Dev ----
  'canvas-basics':       ['js-dom'],
  'canvas-animation':    ['canvas-basics'],
  'canvas-game-logic':   ['canvas-animation', 'js-conditionals'],

  // ---- World 5 – Python ----
  'python-basics':       ['js-variables'],                       // leverage prior programming logic
  'python-conditionals': ['python-basics'],
  'python-loops':        ['python-conditionals'],
  'python-functions':    ['python-loops'],
  'python-data':         ['python-functions'],
};

// ---------------------------------------------------------------------------
// World -> Skills mapping
// ---------------------------------------------------------------------------

const WORLD_SKILLS: Record<number, string[]> = {
  1: ['html-structure', 'html-media', 'css-basics', 'css-layout', 'css-animations'],
  2: ['js-variables', 'js-conditionals', 'js-loops', 'js-functions'],
  3: ['js-dom', 'js-events'],
  4: ['canvas-basics', 'canvas-animation', 'canvas-game-logic'],
  5: ['python-basics', 'python-conditionals', 'python-loops', 'python-functions', 'python-data'],
};

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * Given a set of mastered skill slugs, return all skills that are unlockable
 * (i.e. every prerequisite is in the mastered set) but are NOT yet mastered
 * themselves.
 */
export function getUnlockableSkills(masteredSkills: string[]): string[] {
  const masteredSet = new Set(masteredSkills);
  const unlockable: string[] = [];

  for (const [skill, prereqs] of Object.entries(SKILL_GRAPH)) {
    // Skip skills already mastered
    if (masteredSet.has(skill)) {
      continue;
    }

    // All prerequisites must be mastered
    const allPrereqsMet = prereqs.every((prereq) => masteredSet.has(prereq));
    if (allPrereqsMet) {
      unlockable.push(skill);
    }
  }

  return unlockable;
}

/**
 * Extract the list of mastered skills from a BKT state map.
 * A skill is mastered when its pKnown >= MASTERY_THRESHOLD (0.95).
 */
export function getMasteredSkills(bktState: Map<string, number>): string[] {
  const mastered: string[] = [];

  for (const [skill, pKnown] of bktState) {
    if (pKnown >= MASTERY_THRESHOLD) {
      mastered.push(skill);
    }
  }

  return mastered;
}

/**
 * Return the skill slugs that belong to a particular world (1-5).
 * Returns an empty array for an invalid worldId.
 */
export function getSkillsForWorld(worldId: number): string[] {
  return WORLD_SKILLS[worldId] ?? [];
}
