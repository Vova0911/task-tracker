import type { TaskPriority, TaskStatus } from '../api/types';

// Підписи і кольори для статусів/пріоритетів — в одному місці
export const STATUSES: { id: TaskStatus; label: string; dot: string }[] = [
  { id: 'TODO', label: 'До виконання', dot: 'bg-slate-400' },
  { id: 'IN_PROGRESS', label: 'В роботі', dot: 'bg-amber-400' },
  { id: 'DONE', label: 'Готово', dot: 'bg-emerald-400' },
];

export const PRIORITIES: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: 'Низький', className: 'bg-slate-500/15 text-slate-300' },
  MEDIUM: { label: 'Середній', className: 'bg-sky-500/15 text-sky-300' },
  HIGH: { label: 'Високий', className: 'bg-rose-500/15 text-rose-300' },
};
