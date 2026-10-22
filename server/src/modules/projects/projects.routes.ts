import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import * as projectsController from './projects.controller.js';
import { projectTasksRouter } from '../tasks/tasks.routes.js';

const router = Router();

// Усі маршрути проєктів — тільки з токеном
router.use(requireAuth);

router.get('/', projectsController.list);          // GET    /api/projects
router.post('/', projectsController.create);       // POST   /api/projects
router.get('/:id', projectsController.getOne);     // GET    /api/projects/:id
router.patch('/:id', projectsController.update);   // PATCH  /api/projects/:id
router.delete('/:id', projectsController.remove);  // DELETE /api/projects/:id

// Вкладені маршрути: задачі конкретного проєкту
// /api/projects/:projectId/tasks
router.use('/:projectId/tasks', projectTasksRouter);

export default router;
