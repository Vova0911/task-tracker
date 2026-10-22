import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Налаштування Prisma CLI: де схема, де міграції і як підключитися до БД
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
