import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/health — перевірка, що сервер І база живі
router.get('/', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`; // якщо БД лежить — полетить помилка -> errorHandler -> 500
  res.json({ status: 'ok', database: 'connected', time: new Date().toISOString() });
});

export default router;
