import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { CheckSquare, LogOut, Plus } from 'lucide-react';
import { projectsApi } from '../api/projects';
import { useAuth } from '../context/AuthContext';
import { ProjectModal } from './ProjectModal';

// Каркас застосунку: сайдбар зліва + сторінка справа (<Outlet />)
export function AppLayout() {
  const { user, logout } = useAuth();
  const [showCreate, setShowCreate] = useState(false);

  // useQuery — завантажує дані і кешує їх під ключем ['projects']
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  });

  return (
    <div className="flex h-full">
      <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-surface">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="grid size-8 place-items-center rounded-lg bg-accent">
            <CheckSquare className="size-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight">Task Tracker</span>
        </div>

        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">Проєкти</span>
          <button className="btn-ghost p-1" onClick={() => setShowCreate(true)} aria-label="Новий проєкт">
            <Plus className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {isLoading && <p className="px-2 text-sm text-muted">Завантаження…</p>}
          {!isLoading && projects.length === 0 && (
            <p className="px-2 text-sm text-muted">Ще немає проєктів</p>
          )}
          {projects.map((p) => (
            <NavLink key={p.id} to={`/projects/${p.id}`}
              className={({ isActive }) => clsx(
                'flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition',
                isActive ? 'bg-surface-2 text-white' : 'text-muted hover:bg-surface-2/60 hover:text-slate-100',
              )}>
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="flex-1 truncate">{p.name}</span>
              <span className="text-xs text-muted">{p._count?.tasks ?? 0}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 border-t border-line p-4">
          <div className="grid size-8 place-items-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
            {user?.name[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
          <button className="btn-ghost p-1.5" onClick={logout} aria-label="Вийти" title="Вийти">
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto">
        <Outlet />
      </main>

      {showCreate && <ProjectModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
