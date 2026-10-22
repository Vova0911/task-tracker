import type { Request, Response } from 'express';
import { parseId } from '../projects/projects.controller.js';
import { createTaskSchema, listTasksQuerySchema, updateTaskSchema } from './tasks.schema.js';
import * as tasksService from './tasks.service.js';

// GET /api/projects/:projectId/tasks?status=&search=
export async function listForProject(req: Request, res: Response) {
  const projectId = parseId(req.params.projectId);
  const query = listTasksQuerySchema.parse(req.query);
  const tasks = await tasksService.getAllForProject(req.user!.id, projectId, query);
  res.json(tasks);
}

// POST /api/projects/:projectId/tasks
export async function create(req: Request, res: Response) {
  const projectId = parseId(req.params.projectId);
  const data = createTaskSchema.parse(req.body);
  const task = await tasksService.create(req.user!.id, projectId, data);
  res.status(201).json(task);
}

// PATCH /api/tasks/:id
export async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const data = updateTaskSchema.parse(req.body);
  const task = await tasksService.update(req.user!.id, id, data);
  res.json(task);
}

// DELETE /api/tasks/:id
export async function remove(req: Request, res: Response) {
  const id = parseId(req.params.id);
  await tasksService.remove(req.user!.id, id);
  res.status(204).send();
}
