import { api } from './client';
import type { Project } from './types';

export interface ProjectInput {
  name: string;
  description?: string;
  color?: string;
}

export const projectsApi = {
  list: () => api<Project[]>('/projects'),
  get: (id: number) => api<Project>(`/projects/${id}`),
  create: (body: ProjectInput) =>
    api<Project>('/projects', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: Partial<ProjectInput>) =>
    api<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: number) => api<void>(`/projects/${id}`, { method: 'DELETE' }),
};
