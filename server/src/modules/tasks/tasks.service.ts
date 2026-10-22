import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../utils/AppError.js';
import * as projectsService from '../projects/projects.service.js';
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from './tasks.schema.js';

// Задачі проєкту (з фільтрами)
export async function getAllForProject(userId: number, projectId: number, query: ListTasksQuery) {
  await projectsService.getById(userId, projectId); // проєкт мій? інакше 404

  return prisma.task.findMany({
    where: {
      projectId,
      ...(query.status && { status: query.status }),
      ...(query.search && {
        title: { contains: query.search, mode: 'insensitive' }, // пошук без урахування регістру
      }),
    },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function create(userId: number, projectId: number, data: CreateTaskInput) {
  await projectsService.getById(userId, projectId);

  // нова задача стає в кінець своєї колонки
  const status = data.status ?? 'TODO';
  const count = await prisma.task.count({ where: { projectId, status } });

  return prisma.task.create({
    data: { ...data, status, projectId, position: count },
  });
}

// Знайти задачу, але тільки якщо вона в МОЄМУ проєкті
async function getOwnTask(userId: number, taskId: number) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, project: { ownerId: userId } }, // фільтр через зв'язок!
  });
  if (!task) throw new AppError(404, 'Task not found');
  return task;
}

export async function update(userId: number, taskId: number, data: UpdateTaskInput) {
  await getOwnTask(userId, taskId);
  return prisma.task.update({ where: { id: taskId }, data });
}

export async function remove(userId: number, taskId: number) {
  await getOwnTask(userId, taskId);
  await prisma.task.delete({ where: { id: taskId } });
}
