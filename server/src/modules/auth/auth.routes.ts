import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import * as authController from './auth.controller.js';

// ROUTES = карта: який URL + метод -> який контролер
const router = Router();

router.post('/register', authController.register);  // POST /api/auth/register
router.post('/login', authController.login);        // POST /api/auth/login
router.get('/me', requireAuth, authController.me);  // GET  /api/auth/me  (тільки з токеном)

export default router;
