import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import projectsRoutes from './modules/projects/projects.routes.js';
import { tasksRouter } from './modules/tasks/tasks.routes.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

// app.ts СТВОРЮЄ застосунок, але не запускає його.
// Так його зручно тестувати (у тестах ми імпортуємо app без запуску порту).
export const app = express();

// --- Глобальні middleware (виконуються для КОЖНОГО запиту, по черзі) ---
app.use(helmet());                                        // безпечні HTTP-заголовки
app.use(cors({ origin: env.CLIENT_URL, credentials: true })); // дозволяємо запити з фронтенду
app.use(express.json());                                  // парсимо JSON з body -> req.body
app.use(morgan('dev'));                                   // логи запитів у консоль

// --- Маршрути ---
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/tasks', tasksRouter);

// --- Обробка помилок (ЗАВЖДИ в кінці) ---
app.use(notFound);
app.use(errorHandler);
