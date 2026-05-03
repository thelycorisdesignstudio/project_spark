import Profile from '../models/Profile';
import Progress from '../models/Progress';
import ChatHistory from '../models/ChatHistory';
import Project from '../models/Project';
import { MASTERY_THRESHOLD, getChildBKTState } from './bkt';
import { DifficultyMode, computeDDAMetrics, classifyDifficulty } from './dda';
import { computeFrustrationScore, buildFrustrationSignals } from './frustrationDetector';
import { ParsedError } from './errorAnalyzer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AIContext {
  // Child identity
  childName: string;
  age: number;
  skillLevel: string;
  level: number;

  // Adaptive algorithms
  ddaMode: DifficultyMode;
  frustrationScore: number;
  bktMasteredSkills: string[];
  bktWeakSkills: string[];

  // Current mission progress
  currentWorld: number | undefined;
  currentMission: number | undefined;
  currentStage: number | undefined;
  hintLayerReached: number;
  attemptsOnCurrentStage: number;

  // Code state
  currentCode: {
    html: string;
    css: string;
    js: string;
    python: string;
  };

  // Errors & conversation
  lastErrors: ParsedError[];
  recentMessages: { role: string; content: string }[];
}

// ---------------------------------------------------------------------------
// Module-level error cache — keyed by childId, cleared per session
// ---------------------------------------------------------------------------

const errorCache: Map<string, ParsedError[]> = new Map();
const sessionOwner: Map<string, string> = new Map(); // childId -> sessionId

/**
 * Cache a ParsedError for a given child. Errors accumulate within a session
 * and are cleared automatically when the session changes.
 */
export function cacheError(childId: string, error: ParsedError): void {
  const existing = errorCache.get(childId) ?? [];
  existing.push(error);
  errorCache.set(childId, existing);
}

/**
 * Retrieve cached errors for the child. If the session has changed since
 * errors were last recorded the cache is flushed first.
 */
export function getRecentErrors(childId: string, sessionId?: string): ParsedError[] {
  if (sessionId) {
    const prev = sessionOwner.get(childId);
    if (prev && prev !== sessionId) {
      // New session — clear stale errors
      errorCache.delete(childId);
      sessionOwner.set(childId, sessionId);
      return [];
    }
    sessionOwner.set(childId, sessionId);
  }
  return errorCache.get(childId) ?? [];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ProgressDoc {
  worldId: number;
  missionId: number;
  stageId: number;
  status: string;
  hintLayer: number;
  attempts: number;
  updatedAt: Date;
}

/**
 * Find the most recent in-progress stage from a list of progress documents.
 * Falls back to the most recently updated entry regardless of status if no
 * in-progress stage exists.
 */
export function getCurrentMission(
  progress: ProgressDoc[]
): { worldId: number; missionId: number; stageId: number; hintLayer: number; attempts: number } | null {
  if (!progress || progress.length === 0) return null;

  // Prefer in-progress stages, sorted most recently updated first
  const inProgress = progress
    .filter((p) => p.status === 'in-progress')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const target = inProgress.length > 0
    ? inProgress[0]
    : progress.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

  return {
    worldId: target.worldId,
    missionId: target.missionId,
    stageId: target.stageId,
    hintLayer: target.hintLayer,
    attempts: target.attempts,
  };
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

/**
 * Builds a complete AIContext by loading all relevant data from the database
 * in parallel, computing adaptive metrics, and extracting BKT skill states.
 */
export async function buildAIContext(
  childId: string,
  projectId: string,
  sessionId: string
): Promise<AIContext> {
  // ---- Parallel DB reads + algorithm computations --------------------------
  const [profile, progressDocs, chatMessages, project, bktState, ddaMetrics] = await Promise.all([
    Profile.findOne({ userId: childId }).lean(),
    Progress.find({ childId }).sort({ updatedAt: -1 }).lean(),
    ChatHistory.find({ childId, sessionId }).sort({ createdAt: -1 }).limit(20).lean(),
    Project.findById(projectId).lean(),
    getChildBKTState(childId),
    computeDDAMetrics(childId),
  ]);

  // ---- Adaptive difficulty -------------------------------------------------
  const ddaMode: DifficultyMode = classifyDifficulty(ddaMetrics);

  // ---- Frustration detection -----------------------------------------------
  const recentUserMessages = (chatMessages ?? [])
    .filter((m) => m.role === 'user')
    .map((m) => m.content);

  const cachedErrors = getRecentErrors(childId, sessionId);

  // Compute time-on-stage from the current progress entry
  const currentMissionData = getCurrentMission(progressDocs as unknown as ProgressDoc[]);
  const timeOnStage = currentMissionData
    ? (progressDocs as any[]).find(
        (p: any) =>
          p.worldId === currentMissionData.worldId &&
          p.missionId === currentMissionData.missionId &&
          p.stageId === currentMissionData.stageId
      )?.timeSpentSeconds ?? 0
    : 0;

  const frustrationSignals = buildFrustrationSignals(
    recentUserMessages,
    cachedErrors.length,  // consecutiveErrors: approximate from cached error count
    timeOnStage,
    currentMissionData?.hintLayer ?? 0
  );
  const frustrationScore = computeFrustrationScore(frustrationSignals);

  // ---- BKT mastered vs weak skills -----------------------------------------
  const bktMasteredSkills: string[] = [];
  const bktWeakSkills: string[] = [];

  if (bktState) {
    for (const [skill, mastery] of bktState.entries()) {
      if (mastery >= MASTERY_THRESHOLD) {
        bktMasteredSkills.push(skill);
      } else if (mastery < 0.5) {
        bktWeakSkills.push(skill);
      }
    }
  }

  // ---- Recent messages (oldest-first for conversation order) ---------------
  const recentMessages = (chatMessages ?? [])
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((m) => ({ role: m.role, content: m.content }));

  // ---- Project code --------------------------------------------------------
  const currentCode = {
    html: project?.files?.html ?? '',
    css: project?.files?.css ?? '',
    js: project?.files?.js ?? '',
    python: project?.files?.python ?? '',
  };

  // ---- Assemble context ----------------------------------------------------
  return {
    childName: profile?.displayName ?? 'Coder',
    age: profile?.age ?? 10,
    skillLevel: profile?.skillLevel ?? 'spark-starter',
    level: profile?.level ?? 1,

    ddaMode,
    frustrationScore,
    bktMasteredSkills,
    bktWeakSkills,

    currentWorld: currentMissionData?.worldId,
    currentMission: currentMissionData?.missionId,
    currentStage: currentMissionData?.stageId,
    hintLayerReached: currentMissionData?.hintLayer ?? 0,
    attemptsOnCurrentStage: currentMissionData?.attempts ?? 0,

    currentCode,
    lastErrors: cachedErrors,
    recentMessages,
  };
}
