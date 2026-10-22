import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

// Що ми "зашиваємо" всередину токена. Тільки id — нічого секретного!
// (вміст JWT може прочитати будь-хто, захищений лише ПІДПИС)
export interface JwtPayload {
  userId: number;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

// Перевіряє підпис і термін дії. Якщо токен підроблений/прострочений — кидає помилку.
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
