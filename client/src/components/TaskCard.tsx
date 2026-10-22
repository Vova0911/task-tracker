import clsx from 'clsx';
import { Calendar } from 'lucide-react';
import type { Task } from '../api/types';
import { PRIORITIES } from './taskMeta';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const priority = PRIORITIES[task.priority];
  const isOverdue = task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();

  return (
    <div
      draggable // нативний HTML5 drag & drop
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(task.id)); // "несемо" id задачі
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={onClick}
      className="group cursor-grab rounded-xl border border-line bg-surface-2 p-3.5 transition hover:border-accent/50 hover:shadow-lg hover:shadow-black/20 active:cursor-grabbing"
    >
      <p className={clsx('text-sm font-medium leading-snug', task.status === 'DONE' && 'text-muted line-through')}>
        {task.title}
      </p>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted">{task.description}</p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <span className={clsx('rounded-md px-2 py-0.5 text-[11px] font-medium', priority.className)}>
          {priority.label}
        </span>
        {task.dueDate && (
          <span className={clsx('flex items-center gap-1 text-[11px]', isOverdue ? 'text-rose-400' : 'text-muted')}>
            <Calendar className="size-3" />
            {new Date(task.dueDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </div>
  );
}
