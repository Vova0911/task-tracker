import { z } from 'zod';

// Схема даних для СТВОРЕННЯ проєкту (POST /api/projects)
export const createProjectSchema = z.object({
  // name — обов'язковий рядок, 1..100 символів, без пробілів по краях
  name: z.string().trim().min(1).max(100),

  // description — необов'язковий опис, до 500 символів
  description: z.string().trim().max(500).optional(),

  // color — необов'язковий колір у форматі HEX, наприклад "#6366f1"
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Колір у форматі #RRGGBB')
    .optional(),
});

// Схема для ОНОВЛЕННЯ (PATCH /api/projects/:id):
// ті самі правила, але кожне поле необов'язкове — можна змінити лише одне
export const updateProjectSchema = createProjectSchema.partial();

// TypeScript-типи, згенеровані зі схем
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
