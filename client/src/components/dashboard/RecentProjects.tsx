import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectService } from '../../services/project.service';
import LoadingSkeleton from '../ui/LoadingSkeleton';

interface ProjectSummary {
  _id: string;
  title: string;
  language: 'html' | 'python';
  updatedAt: string;
}

export default function RecentProjects() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    projectService
      .getAll(1, 4)
      .then((data) => setProjects(data.projects as ProjectSummary[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h2
          className="text-xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Recent Projects
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div>
        <h2
          className="text-xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Recent Projects
        </h2>
        <div
          className="p-8 rounded-2xl text-center"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span className="text-4xl mb-3 block">🚀</span>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            No projects yet. Start coding to create your first one!
          </p>
          <Link to="/editor/new">
            <motion.button
              className="px-6 py-2 rounded-xl text-sm font-medium cursor-pointer"
              style={{
                backgroundColor: 'rgba(8, 145, 178, 0.1)',
                color: 'var(--neon-cyan)',
                border: '1px solid var(--border-glow-cyan)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start a Project
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const languageBadge: Record<string, { label: string; color: string; bg: string }> = {
    html: { label: 'HTML', color: 'var(--neon-violet)', bg: 'rgba(124, 58, 237, 0.1)' },
    python: { label: 'Python', color: 'var(--neon-green)', bg: 'rgba(5, 150, 105, 0.1)' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Recent Projects
        </h2>
        <Link
          to="/projects"
          className="text-xs font-medium"
          style={{ color: 'var(--neon-cyan)', textDecoration: 'none' }}
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {projects.map((project, i) => {
          const badge = languageBadge[project.language] ?? languageBadge.html;

          return (
            <motion.div
              key={project._id}
              className="p-4 rounded-xl cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ scale: 1.03, y: -3, boxShadow: 'var(--shadow-card)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/editor/${project._id}`)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">
                  {project.language === 'python' ? '🐍' : '🌐'}
                </span>
                <h3
                  className="text-sm font-bold truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {project.title}
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: badge.bg,
                    color: badge.color,
                  }}
                >
                  {badge.label}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
