import { projectService } from '../services/project.service';

interface ProjectFiles {
  html: string;
  css: string;
  js: string;
  python: string;
}

let lastSavedHash = '';
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function hashCode(files: ProjectFiles): string {
  const content = JSON.stringify(files);
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (Math.imul(31, hash) + content.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

export function smartAutoSave(files: ProjectFiles, projectId: string): void {
  if (saveTimer) clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    const currentHash = hashCode(files);
    if (currentHash === lastSavedHash) return;

    try {
      await projectService.update(projectId, { files });
      lastSavedHash = currentHash;
    } catch {
      // Emergency backup to localStorage
      localStorage.setItem(`spark_backup_${projectId}`, JSON.stringify({ files, timestamp: Date.now() }));
    }
  }, 3000);
}

export function checkForBackup(projectId: string): { files: ProjectFiles; timestamp: number } | null {
  const backup = localStorage.getItem(`spark_backup_${projectId}`);
  if (!backup) return null;
  try {
    return JSON.parse(backup);
  } catch {
    return null;
  }
}

export function clearBackup(projectId: string): void {
  localStorage.removeItem(`spark_backup_${projectId}`);
}

export function resetSaveHash(): void {
  lastSavedHash = '';
}
