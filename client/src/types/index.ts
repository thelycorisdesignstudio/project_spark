// ─── User & Auth ────────────────────────────────────────────────
export interface User {
  _id: string;
  email: string;
  role: 'parent' | 'child';
  googleId?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  _id: string;
  userId: string;
  parentId?: string;
  displayName: string;
  avatarUrl?: string;
  avatarColor: string;
  age?: number;
  skillLevel: 'spark-starter' | 'code-explorer' | 'build-master' | 'code-wizard' | 'spark-legend';
  xp: number;
  level: number;
  streakCount: number;
  streakFreezes: number;
  lastActiveDate?: string;
  totalTimeSpentMinutes: number;
  dailyTimeLimitMinutes?: number;
  publicSharingEnabled: boolean;
  soundEnabled: boolean;
  skillKnowledgeState: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

// ─── Projects ───────────────────────────────────────────────────
export interface ProjectFiles {
  html: string;
  css: string;
  js: string;
  python: string;
}

export interface Project {
  _id: string;
  childId: string;
  title: string;
  description?: string;
  language: 'html' | 'python';
  files: ProjectFiles;
  thumbnailUrl?: string;
  shareSlug?: string;
  isPublic: boolean;
  isFeatured: boolean;
  viewCount: number;
  missionRef?: { worldId: number; missionId: number };
  createdAt: string;
  updatedAt: string;
}

// ─── Progress ───────────────────────────────────────────────────
export interface ProgressRecord {
  _id: string;
  childId: string;
  worldId: number;
  missionId: number;
  stageId: number;
  status: 'locked' | 'in-progress' | 'completed';
  hintsUsed: number;
  hintLayer: number;
  timeSpentSeconds: number;
  xpEarned: number;
  attempts: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Badges ─────────────────────────────────────────────────────
export interface Badge {
  _id: string;
  childId: string;
  badgeSlug: string;
  earnedAt: string;
  seen: boolean;
}

// ─── Chat ───────────────────────────────────────────────────────
export type BuddyEmotion = 'happy' | 'excited' | 'thinking' | 'celebrating' | 'concerned' | 'encouraging' | 'neutral' | 'curious';

export interface ChatMessage {
  _id: string;
  childId: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  buddyEmotion?: BuddyEmotion;
  createdAt: string;
}

// ─── Subscription ───────────────────────────────────────────────
export interface Subscription {
  _id: string;
  parentId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: 'free' | 'pro' | 'family' | 'school';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodEnd?: string;
  childSlots: number;
}

// ─── Validation ─────────────────────────────────────────────────
export interface ValidationCheckpoint {
  id: string;
  label: string;
  validator: (html: string, css: string, js: string, python: string) => boolean;
}

export interface ValidationResult {
  passed: boolean;
  checkpoints: { id: string; label: string; passed: boolean }[];
}

// ─── Auth ───────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// ─── API ────────────────────────────────────────────────────────
export interface ApiError {
  error: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  projects: T[];
  total: number;
  page: number;
  pages: number;
}
