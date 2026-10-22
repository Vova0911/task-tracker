import { api } from './client';
import type { AuthResponse, User } from './types';

export const authApi = {
  register: (body: { email: string; name: string; password: string }) =>
    api<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    api<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  me: () => api<{ user: User }>('/auth/me'),
};
