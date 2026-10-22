import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '../config/env.js';

// Один спільний клієнт бази на весь застосунок.
// Імпортуємо його в сервісах: import { prisma } from '../lib/prisma.js'
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
