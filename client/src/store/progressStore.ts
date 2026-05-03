import { create } from 'zustand';
import type { ProgressRecord } from '../types';

interface ProgressState {
  progress: ProgressRecord[];
  isLoaded: boolean;
  setProgress: (progress: ProgressRecord[]) => void;
  updateStage: (record: ProgressRecord) => void;
  getStageStatus: (worldId: number, missionId: number, stageId: number) => 'locked' | 'in-progress' | 'completed';
  getMissionStatus: (worldId: number, missionId: number) => 'locked' | 'in-progress' | 'completed';
  getWorldStatus: (worldId: number) => 'locked' | 'in-progress' | 'completed';
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: [],
  isLoaded: false,

  setProgress: (progress) => set({ progress, isLoaded: true }),

  updateStage: (record) =>
    set((state) => {
      const idx = state.progress.findIndex(
        (p) => p.worldId === record.worldId && p.missionId === record.missionId && p.stageId === record.stageId
      );
      const newProgress = [...state.progress];
      if (idx >= 0) newProgress[idx] = record;
      else newProgress.push(record);
      return { progress: newProgress };
    }),

  getStageStatus: (worldId, missionId, stageId) => {
    const record = get().progress.find(
      (p) => p.worldId === worldId && p.missionId === missionId && p.stageId === stageId
    );
    return record?.status || 'locked';
  },

  getMissionStatus: (worldId, missionId) => {
    const stages = get().progress.filter(
      (p) => p.worldId === worldId && p.missionId === missionId
    );
    if (stages.length === 0) return 'locked';
    if (stages.every((s) => s.status === 'completed')) return 'completed';
    return 'in-progress';
  },

  getWorldStatus: (worldId) => {
    const stages = get().progress.filter((p) => p.worldId === worldId);
    if (stages.length === 0) return 'locked';
    if (stages.filter((s) => s.status === 'completed').length === 18) return 'completed';
    return 'in-progress';
  },
}));
