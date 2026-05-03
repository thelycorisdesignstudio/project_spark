import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import EditorLayout from '../components/editor/EditorLayout';
import ProjectTemplateModal from '../components/editor/ProjectTemplateModal';
import { useEditorStore } from '../store/editorStore';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { projectService } from '../services/project.service';
import type { ProjectFiles } from '../types';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { setProject } = useEditorStore();
  const { setSessionId } = useChatStore();
  const { profile } = useAuthStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Extract mission context from URL query params
  const missionContext = useMemo(() => {
    const worldId = searchParams.get('worldId');
    const missionId = searchParams.get('missionId');
    const stageId = searchParams.get('stageId');

    if (worldId && missionId && stageId) {
      return {
        worldId: Number(worldId),
        missionId: Number(missionId),
        stageId: Number(stageId),
      };
    }

    // Also check localStorage fallback
    try {
      const stored = localStorage.getItem('spark_mission_context');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.worldId && parsed.missionId && parsed.stageId) {
          return parsed as { worldId: number; missionId: number; stageId: number };
        }
      }
    } catch { /* ignore */ }

    return null;
  }, [searchParams]);

  const createProjectWithFiles = async (files: ProjectFiles, title: string) => {
    try {
      const project = await projectService.create({ title });
      await projectService.update(project._id, { files });
      setProject(project._id, project.title, project.language, files);
      setSessionId(`${profile?._id}-${project._id}-${Date.now()}`);
      window.history.replaceState(null, '', `/editor/${project._id}`);
      setShowTemplates(false);
      setLoaded(true);
    } catch (err) {
      console.error('Failed to create project:', err);
      setProject('local', title, 'html', files);
      setSessionId(`local-${Date.now()}`);
      setShowTemplates(false);
      setLoaded(true);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (id && id !== 'new') {
        try {
          const project = await projectService.getById(id);
          setProject(project._id, project.title, project.language, project.files);
          setSessionId(`${profile?._id}-${project._id}-${Date.now()}`);
          setLoaded(true);
        } catch (err) {
          console.error('Failed to load project:', err);
          setLoaded(true);
        }
      } else if (!missionContext) {
        // New project without mission context — show template picker
        setShowTemplates(true);
        setLoaded(true);
      } else {
        // New project with mission context — create immediately
        try {
          const project = await projectService.create({ title: 'Untitled Project' });
          setProject(project._id, project.title, project.language, project.files);
          setSessionId(`${profile?._id}-${project._id}-${Date.now()}`);
          window.history.replaceState(null, '', `/editor/${project._id}`);
          setLoaded(true);
        } catch (err) {
          console.error('Failed to create project:', err);
          setProject('local', 'Untitled Project', 'html', { html: '', css: '', js: '', python: '' });
          setSessionId(`local-${Date.now()}`);
          setLoaded(true);
        }
      }
    };

    load();
  }, [id]);

  return (
    <>
      {showTemplates && (
        <ProjectTemplateModal onSelect={createProjectWithFiles} />
      )}
      {loaded && !showTemplates && (
        <EditorLayout
          missionMode={!!missionContext}
          worldId={missionContext?.worldId}
          missionId={missionContext?.missionId}
          stageId={missionContext?.stageId}
        />
      )}
    </>
  );
}
