// Типи даних, які повертає наш бекенд (дзеркало моделей з schema.prisma)

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  _count?: { tasks: number };
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
