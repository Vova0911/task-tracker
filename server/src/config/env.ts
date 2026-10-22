import 'dotenv/config';
import { z } from 'zod';

// Описуємо, які змінні середовища ОБОВ'ЯЗКОВІ і якого вони типу.
// Якщо чогось бракує — сервер впаде одразу при старті з зрозумілою помилкою,
// а не через годину десь посеред запиту.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET має бути мінімум 32 символи'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Невірні змінні середовища:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
