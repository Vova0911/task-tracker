import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../utils/AppError.js';
import type { CreateProjectInput, UpdateProjectInput } from './projects.schema.js';

// ============================================================================
// СЕРВІС ПРОЄКТІВ
// Тут вся бізнес-логіка і робота з базою. Сервіс НЕ знає про req/res —
// він отримує звичайні аргументи і повертає звичайні дані (або кидає AppError).
//
// ГОЛОВНЕ ПРАВИЛО БЕЗПЕКИ: кожна функція отримує userId і працює
// ТІЛЬКИ з проєктами цього користувача. Чужі проєкти — "не існують".
// ============================================================================

// ---------------------------------------------------------------------------
// Отримати ВСІ проєкти користувача
// GET /api/projects
// ---------------------------------------------------------------------------
export async function getAll(userId: number) {
  // findMany = SELECT ... WHERE ... (повертає масив, може бути порожній [])
  return prisma.project.findMany({
    where: { ownerId: userId },          // тільки мої проєкти
    orderBy: { createdAt: 'desc' },      // нові зверху
    include: {
      // _count — Prisma порахує кількість пов'язаних задач,
      // не завантажуючи самі задачі. У відповіді буде: "_count": { "tasks": 5 }
      _count: { select: { tasks: true } },
    },
  });
}

// ---------------------------------------------------------------------------
// Отримати ОДИН проєкт
// GET /api/projects/:id
// ---------------------------------------------------------------------------
export async function getById(userId: number, projectId: number) {
  // findFirst з ДВОМА умовами: id збігається І власник — я.
  // Якщо проєкт існує, але чужий — його просто не знайде.
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    include: { _count: { select: { tasks: true } } },
  });

  // Чому 404, а не 403 "Forbidden"?
  // 403 підказало б зловмиснику, що проєкт з таким id ІСНУЄ.
  // 404 — "нічого не знаю" — безпечніше.
  if (!project) {
    throw new AppError(404, 'Project not found');
  }

  return project;
}

// ---------------------------------------------------------------------------
// СТВОРИТИ проєкт
// POST /api/projects
// ---------------------------------------------------------------------------
export async function create(userId: number, data: CreateProjectInput) {
  // create = INSERT INTO projects (...) VALUES (...)
  return prisma.project.create({
    data: {
      ...data,           // name, description, color — з уже перевіреної схеми
      ownerId: userId,   // власника беремо з ТОКЕНА, а не з body!
                         // інакше хтось міг би створити проєкт "від імені" іншого
    },
  });
}

// ---------------------------------------------------------------------------
// ОНОВИТИ проєкт
// PATCH /api/projects/:id
// ---------------------------------------------------------------------------
export async function update(userId: number, projectId: number, data: UpdateProjectInput) {
  // Спершу перевіряємо, що проєкт існує і він МІЙ.
  // Перевикористовуємо getById — якщо ні, вона сама кине 404.
  await getById(userId, projectId);

  // update = UPDATE projects SET ... WHERE id = ...
  // Оновляться ТІЛЬКИ ті поля, що прийшли в data (решта не зміниться)
  return prisma.project.update({
    where: { id: projectId },
    data,
  });
}

// ---------------------------------------------------------------------------
// ВИДАЛИТИ проєкт
// DELETE /api/projects/:id
// ---------------------------------------------------------------------------
export async function remove(userId: number, projectId: number) {
  await getById(userId, projectId); // той самий захист: тільки свій

  // delete = DELETE FROM projects WHERE id = ...
  // Задачі цього проєкту видаляться автоматично — бо в schema.prisma
  // ми написали onDelete: Cascade
  await prisma.project.delete({ where: { id: projectId } });
}

// P.S. Функція називається remove, а не delete, бо delete — зарезервоване
// слово в JavaScript (оператор delete obj.prop).
