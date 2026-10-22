import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import * as tasksController from './tasks.controller.js';

// 1) Вкладений роутер: /api/projects/:projectId/tasks
//    mergeParams: true — щоб бачити :projectId з батьківського роутера
export const projectTasksRouter = Router({ mergeParams: true });
projectTasksRouter.get('/', tasksController.listForProject);
projectTasksRouter.post('/', tasksController.create);

// 2) Роутер окремої задачі: /api/tasks/:id
export const tasksRouter = Router();
tasksRouter.use(requireAuth);
tasksRouter.patch('/:id', tasksController.update);
tasksRouter.delete('/:id', tasksController.remove);
