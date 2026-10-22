import { z } from 'zod';

// Схеми валідації: що ми чекаємо в body запиту.
// z.infer автоматично робить з них TypeScript-типи — не треба писати двічі.

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Невірний email'),
  name: z.string().trim().min(2, 'Ім\'я мінімум 2 символи').max(50),
  password: z.string().min(8, 'Пароль мінімум 8 символів').max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Невірний email'),
  password: z.string().min(1, 'Введіть пароль'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
