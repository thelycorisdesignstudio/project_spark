import { v4 as uuidv4 } from 'uuid';

export const generateShareSlug = (): string => {
  return uuidv4().replace(/-/g, '').substring(0, 12);
};

export const generateSessionId = (childId: string, projectId: string): string => {
  return `${childId}-${projectId}-${Date.now()}`;
};
