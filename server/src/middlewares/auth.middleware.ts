import type { RequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

// Охоронець захищених маршрутів.
// Клієнт надсилає заголовок:  Authorization: Bearer <token>
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'Not authenticated');
  }

  const token = header.slice('Bearer '.length);

  try {
    const { userId } = verifyToken(token);
    req.user = { id: userId }; // далі контролери знають, хто робить запит
    next();
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }
};
