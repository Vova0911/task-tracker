import type { Request, Response } from 'express';
import { loginSchema, registerSchema } from './auth.schema.js';
import * as authService from './auth.service.js';

// КОНТРОЛЕР = "перекладач" між HTTP і сервісом:
// 1) дістає дані з req  2) валідує  3) викликає сервіс  4) відправляє res
// Помилки не ловимо: Express 5 сам передасть їх в errorHandler.

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body); // невалідно -> ZodError -> 400
  const result = await authService.register(data);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  const result = await authService.login(data);
  res.json(result);
}

export async function me(req: Request, res: Response) {
  const user = await authService.getMe(req.user!.id); // ! — бо requireAuth гарантує user
  res.json({ user });
}
