import type { Request, Response } from 'express';
import { z } from 'zod';
import { createProjectSchema, updateProjectSchema } from './projects.schema.js';
import * as projectsService from './projects.service.js';

// КОНТРОЛЕР: 1) дані з req  2) виклик сервісу  3) відповідь через res

// Бере :id з URL і перетворює "5" -> 5. Якщо "abc" чи -1 — ZodError -> 400.
export function parseId(value: unknown): number {
  return z.coerce.number().int().positive().parse(value);
}

// GET /api/projects
export async function list(req: Request, res: Response) {
  const projects = await projectsService.getAll(req.user!.id);
  res.json(projects);
}

// GET /api/projects/:id
export async function getOne(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const project = await projectsService.getById(req.user!.id, id);
  res.json(project);
}

// POST /api/projects
export async function create(req: Request, res: Response) {
  const data = createProjectSchema.parse(req.body);
  const project = await projectsService.create(req.user!.id, data);
  res.status(201).json(project);
}

// PATCH /api/projects/:id
export async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const data = updateProjectSchema.parse(req.body);
  const project = await projectsService.update(req.user!.id, id, data);
  res.json(project);
}

// DELETE /api/projects/:id
export async function remove(req: Request, res: Response) {
  const id = parseId(req.params.id);
  await projectsService.remove(req.user!.id, id);
  res.status(204).send(); // 204 No Content — успіх, тіла немає
}
