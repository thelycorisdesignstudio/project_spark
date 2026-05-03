import { create } from 'zustand';
import type { ProjectFiles } from '../types';

type ActiveTab = 'html' | 'css' | 'js' | 'python';

interface EditorState {
  projectId: string | null;
  projectTitle: string;
  language: 'html' | 'python';
  files: ProjectFiles;
  activeTab: ActiveTab;
  isDirty: boolean;
  lastSavedAt: number | null;
  previewKey: number;

  setProject: (id: string, title: string, language: 'html' | 'python', files: ProjectFiles) => void;
  setActiveTab: (tab: ActiveTab) => void;
  updateFile: (tab: ActiveTab, content: string) => void;
  markSaved: () => void;
  refreshPreview: () => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  projectId: null,
  projectTitle: 'Untitled Project',
  language: 'html',
  files: { html: '', css: '', js: '', python: '' },
  activeTab: 'html',
  isDirty: false,
  lastSavedAt: null,
  previewKey: 0,

  setProject: (id, title, language, files) =>
    set({
      projectId: id,
      projectTitle: title,
      language,
      files,
      activeTab: language === 'python' ? 'python' : 'html',
      isDirty: false,
    }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  updateFile: (tab, content) =>
    set((state) => ({
      files: { ...state.files, [tab]: content },
      isDirty: true,
    })),

  markSaved: () => set({ isDirty: false, lastSavedAt: Date.now() }),

  refreshPreview: () => set((state) => ({ previewKey: state.previewKey + 1 })),

  reset: () =>
    set({
      projectId: null,
      projectTitle: 'Untitled Project',
      language: 'html',
      files: { html: '', css: '', js: '', python: '' },
      activeTab: 'html',
      isDirty: false,
      lastSavedAt: null,
      previewKey: 0,
    }),
}));
