import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/authStore';
import { authService } from './services/auth.service';
import AppShell from './components/layout/AppShell';

// Lazy load pages for performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ChildLoginPage = lazy(() => import('./pages/ChildLoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WorldMapPage = lazy(() => import('./pages/WorldMapPage'));
const EditorPage = lazy(() => import('./pages/EditorPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ParentDashboardPage = lazy(() => import('./pages/ParentDashboardPage'));
const WorldDetailPage = lazy(() => import('./pages/WorldDetailPage'));
const MissionPage = lazy(() => import('./pages/MissionPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const BadgesPage = lazy(() => import('./pages/BadgesPage'));
const ParentChildDetailPage = lazy(() => import('./pages/ParentChildDetailPage'));
const ParentSettingsPage = lazy(() => import('./pages/ParentSettingsPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Loading skeleton
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-void)' }}
    >
      <div className="text-center">
        <div
          className="text-3xl font-bold mb-4 animate-pulse"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-cyan)' }}
        >
          SPARK
        </div>
        <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
          <div
            className="h-full rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--neon-cyan)', width: '60%' }}
          />
        </div>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'parent' | 'child' }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'parent' ? '/parent' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { setAuth, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('spark_access_token');
    if (token) {
      authService.getMe()
        .then(({ user, profile }) => setAuth(user, profile))
        .catch(() => clearAuth());
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/child-login" element={<ChildLoginPage />} />

          {/* Child Routes (with nav shell) */}
          <Route element={
            <ProtectedRoute requiredRole="child">
              <AppShell />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/worlds" element={<WorldMapPage />} />
            <Route path="/worlds/:worldId" element={<WorldDetailPage />} />
            <Route path="/worlds/:worldId/missions/:missionId" element={<MissionPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Editor (full screen, no shell) */}
          <Route path="/editor/:id" element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          } />

          {/* Onboarding (parent only) */}
          <Route path="/onboarding" element={
            <ProtectedRoute requiredRole="parent">
              <OnboardingPage />
            </ProtectedRoute>
          } />

          {/* Parent Routes */}
          <Route path="/parent" element={
            <ProtectedRoute requiredRole="parent">
              <ParentDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/parent/child/:childId" element={
            <ProtectedRoute requiredRole="parent">
              <ParentChildDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/parent/settings" element={
            <ProtectedRoute requiredRole="parent">
              <ParentSettingsPage />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
