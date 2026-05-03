import api from './api';

export interface Recommendation {
  action: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface DDAStatus {
  mode: 'too-easy' | 'optimal' | 'too-hard' | 'struggling';
  metrics: Record<string, number> | null;
  instructions: string;
}

export interface SkillMap {
  skills: Record<string, number>;
  mastered: string[];
  unlockable: string[];
  masteryThreshold: number;
}

export interface AnalyticsSummary {
  totalStagesCompleted: number;
  totalTimeMinutes: number;
  totalHintsUsed: number;
  level: number;
  xp: number;
  streakCount: number;
}

export interface ParsedError {
  category: string;
  line: number | null;
  message: string;
  kidFriendlyExplanation: string;
  commonCause: string;
  fixHint: string;
}

export interface QualityScore {
  total: number;
  breakdown: { readability: number; structure: number; creativity: number; efficiency: number };
  bonusXP: number;
  buddyComment: string;
}

export interface CodeRunResult {
  success: boolean;
  error?: ParsedError;
  qualityScore?: QualityScore;
}

export interface SessionEndResult {
  wasInFlow: boolean;
  fatigued: boolean;
  sessionSummary: {
    minutes: number;
    stagesCompleted: number;
    xpEarned: number;
  };
}

export const intelligenceService = {
  getRecommendation: async (): Promise<Recommendation> => {
    const { data } = await api.get('/intelligence/recommendation');
    return data;
  },

  getDDAStatus: async (): Promise<DDAStatus> => {
    const { data } = await api.get('/intelligence/dda');
    return data;
  },

  getSkillMap: async (): Promise<SkillMap> => {
    const { data } = await api.get('/intelligence/skills');
    return data;
  },

  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    const { data } = await api.get('/intelligence/analytics/summary');
    return data;
  },

  reportCodeRun: async (
    sessionId: string,
    success: boolean,
    error?: string,
    code?: { html?: string; css?: string; js?: string; python?: string }
  ): Promise<CodeRunResult> => {
    const { data } = await api.post('/intelligence/code-run', {
      sessionId,
      success,
      error,
      code,
    });
    return data;
  },

  reportSessionEnd: async (
    sessionId: string,
    sessionLengthMinutes: number,
    codeChanges: number,
    stagesCompleted: number,
    xpEarned: number
  ): Promise<SessionEndResult> => {
    const { data } = await api.post('/intelligence/session-end', {
      sessionId,
      sessionLengthMinutes,
      codeChanges,
      stagesCompleted,
      xpEarned,
    });
    return data;
  },
};
