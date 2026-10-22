// Власний клас помилки: несе HTTP-статус.
// У будь-якому місці коду пишемо: throw new AppError(404, 'Task not found')
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
