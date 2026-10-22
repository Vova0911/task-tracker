import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { signToken } from '../../utils/jwt.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

// СЕРВІС = бізнес-логіка + робота з базою. Нічого не знає про req/res.

// Які поля користувача віддаємо назовні. passwordHash — НІКОЛИ.
const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
} as const;

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, 'User with this email already exists');
  }

  // Хешуємо пароль. 10 — "складність" (кількість раундів), стандартне значення.
  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: { email: input.email, name: input.name, passwordHash },
    select: publicUserSelect,
  });

  const token = signToken({ userId: user.id });
  return { user, token };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Однакова помилка для "нема юзера" і "невірний пароль" —
  // щоб зловмисник не міг дізнатися, які email зареєстровані.
  const isValid = user && (await bcrypt.compare(input.password, user.passwordHash));
  if (!user || !isValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = signToken({ userId: user.id });
  return {
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    token,
  };
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
}
