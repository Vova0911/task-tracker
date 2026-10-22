import { z } from 'zod';

// Значення мають збігатися з enum у schema.prisma
export const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  // дата приходить рядком "2026-10-30" -> перетворюємо на Date; null = прибрати дедлайн
  dueDate: z.coerce.date().nullable().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  position: z.number().int().min(0).optional(),
});

// Query-параметри для списку: /tasks?status=DONE&search=молоко
export const listTasksQuerySchema = z.object({
  status: taskStatusEnum.optional(),
  search: z.string().trim().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
