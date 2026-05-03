import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import { projectService } from '../services/project.service';
import type { Project } from '../types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getAll()
      .then((data) => setProjects(data.projects))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            My Projects 📁
          </h1>
          <Link to="/editor/new">
            <motion.button
              className="px-6 py-2 rounded-xl text-sm font-bold cursor-pointer"
              style={{
                backgroundColor: 'var(--neon-cyan)',
                color: '#ffffff',
                boxShadow: 'var(--shadow-cyan)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + New Project
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl skeleton"
                style={{ backgroundColor: 'var(--bg-surface)' }}
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div
            className="p-12 rounded-2xl text-center"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span className="text-5xl mb-4 block">💻</span>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              No projects yet
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Start coding to create your first project!
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
              >
                Create a Project
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <Link key={project._id} to={`/editor/${project._id}`}>
                <motion.div
                  className="p-5 rounded-2xl cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.03, y: -4, boxShadow: 'var(--shadow-float)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span>{project.language === 'python' ? '🐍' : '🌐'}</span>
                    <h3
                      className="text-sm font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    {project.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                    {project.isPublic && (
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)', color: 'var(--neon-green)' }}
                      >
                        Public
                      </span>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
