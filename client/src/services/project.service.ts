import api from './api';
import type { Project, ProjectFiles } from '../types';

export const projectService = {
  getAll: async (page = 1, limit = 20) => {
    const { data } = await api.get('/projects', { params: { page, limit } });
    return data as { projects: Project[]; total: number; page: number; pages: number };
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/projects/${id}`);
    return data as Project;
  },

  create: async (project: { title: string; language?: 'html' | 'python'; missionRef?: { worldId: number; missionId: number } }) => {
    const { data } = await api.post('/projects', project);
    return data as Project;
  },

  update: async (id: string, updates: { title?: string; description?: string; files?: ProjectFiles }) => {
    const { data } = await api.put(`/projects/${id}`, updates);
    return data as Project;
  },

  delete: async (id: string) => {
    await api.delete(`/projects/${id}`);
  },

  publish: async (id: string) => {
    const { data } = await api.post(`/projects/${id}/publish`);
    return data as { isPublic: boolean; shareSlug: string };
  },

  getPublic: async (slug: string) => {
    const { data } = await api.get(`/projects/public/${slug}`);
    return data as Project;
  },
};
