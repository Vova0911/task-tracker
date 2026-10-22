import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

// 404 — якщо жоден маршрут не підійшов
export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
};

// Централізований обробник помилок. Express розпізнає його за 4 аргументами.
// Усі throw з контролерів (навіть з async функцій в Express 5) потрапляють сюди.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Validation error', errors: err.flatten().fieldErrors });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};
