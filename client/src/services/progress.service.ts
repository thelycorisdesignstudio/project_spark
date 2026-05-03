import api from './api';
import type { ProgressRecord } from '../types';

export const progressService = {
  getAll: async () => {
    const { data } = await api.get('/progress');
    return data as ProgressRecord[];
  },

  getWorld: async (worldId: number) => {
    const { data } = await api.get(`/progress/world/${worldId}`);
    return data as ProgressRecord[];
  },

  completeStage: async (payload: {
    worldId: number;
    missionId: number;
    stageId: number;
    timeSpentSeconds?: number;
    hintsUsed?: number;
  }) => {
    const { data } = await api.post('/progress/stage/complete', payload);
    return data;
  },

  completeMission: async (worldId: number, missionId: number) => {
    const { data } = await api.post('/progress/mission/complete', { worldId, missionId });
    return data;
  },

  completeWorld: async (worldId: number) => {
    const { data } = await api.post('/progress/world/complete', { worldId });
    return data;
  },
};
