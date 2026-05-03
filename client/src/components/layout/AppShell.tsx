import { Outlet } from 'react-router-dom';
import ChildNav from './ChildNav';

export default function AppShell() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-void)' }}>
      <ChildNav />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
