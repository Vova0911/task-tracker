import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Plus, Search, Trash2 } from 'lucide-react';
import { projectsApi } from '../api/projects';
import { tasksApi } from '../api/tasks';
import type { Task, TaskStatus } from '../api/types';
import { Spinner } from '../components/Spinner';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { STATUSES } from '../components/taskMeta';

// Канбан-дошка проєкту: 3 колонки, перетягування задач між ними
export function BoardPage() {
  const projectId = Number(useParams().id); // :id з URL /projects/:id
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ task?: Task; status?: TaskStatus } | null>(null);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId),
  });

  const tasksKey = ['tasks', projectId];
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: tasksKey,
    queryFn: () => tasksApi.list(projectId),
  });

  // Зміна статусу з "оптимістичним оновленням":
  // спершу міняємо задачу на екрані миттєво, потім чекаємо сервер.
  // Якщо сервер відповів помилкою — повертаємо як було.
  const moveTask = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TaskStatus }) => tasksApi.update(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: tasksKey });
      const previous = queryClient.getQueryData<Task[]>(tasksKey);
      queryClient.setQueryData<Task[]>(tasksKey, (old = []) =>
        old.map((t) => (t.id === id ? { ...t, status } : t)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => queryClient.setQueryData(tasksKey, ctx?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey }),
  });

  const deleteProject = useMutation({
    mutationFn: () => projectsApi.remove(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/');
    },
  });

  function handleDrop(e: React.DragEvent, status: TaskStatus) {
    e.preventDefault();
    setDragOver(null);
    const id = Number(e.dataTransfer.getData('text/plain'));
    const task = tasks.find((t) => t.id === id);
    if (task && task.status !== status) moveTask.mutate({ id, status });
  }

  // пошук фільтруємо на клієнті — миттєво, без запитів
  const visible = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full flex-col">
      {/* Шапка */}
      <header className="flex flex-wrap items-center gap-4 border-b border-line px-8 py-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: project?.color }} />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight">{project?.name ?? '…'}</h1>
            {project?.description && <p className="truncate text-sm text-muted">{project.description}</p>}
          </div>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input className="input w-56 pl-9" placeholder="Пошук задач…" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={() => setModal({ status: 'TODO' })}>
          <Plus className="size-4" /> Задача
        </button>
        <button className="btn-ghost p-2" title="Видалити проєкт"
          onClick={() => confirm(`Видалити проєкт «${project?.name}» разом з усіма задачами?`) && deleteProject.mutate()}>
          <Trash2 className="size-4" />
        </button>
      </header>

      {/* Колонки */}
      {isLoading ? (
        <div className="grid flex-1 place-items-center"><Spinner /></div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-5 overflow-auto p-8 md:grid-cols-3">
          {STATUSES.map((col) => {
            const colTasks = visible.filter((t) => t.status === col.id);
            return (
              <section key={col.id}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={clsx(
                  'flex min-h-64 flex-col rounded-2xl border bg-surface/60 p-3 transition',
                  dragOver === col.id ? 'border-accent/60 bg-accent/5' : 'border-line',
                )}>
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span className={clsx('size-2 rounded-full', col.dot)} />
                  <h2 className="text-sm font-medium">{col.label}</h2>
                  <span className="rounded-md bg-surface-2 px-1.5 text-xs text-muted">{colTasks.length}</span>
                  <button className="btn-ghost ml-auto p-1" aria-label="Додати"
                    onClick={() => setModal({ status: col.id })}>
                    <Plus className="size-4" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col gap-2.5">
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onClick={() => setModal({ task })} />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-line p-6 text-xs text-muted">
                      Перетягни задачу сюди
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {modal && (
        <TaskModal
          key={modal.task?.id ?? 'new'}
          projectId={projectId}
          task={modal.task}
          defaultStatus={modal.status}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
