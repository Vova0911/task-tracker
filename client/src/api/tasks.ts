import { api } from './client';
import type { Task, TaskPriority, TaskStatus } from './types';

export interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export const tasksApi = {
  list: (projectId: number, search?: string) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return api<Task[]>(`/projects/${projectId}/tasks${qs}`);
  },
  create: (projectId: number, body: TaskInput) =>
    api<Task>(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: Partial<TaskInput>) =>
    api<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: number) => api<void>(`/tasks/${id}`, { method: 'DELETE' }),
};
