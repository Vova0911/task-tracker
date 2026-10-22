// Розширюємо тип Request з Express: додаємо поле user,
// яке заповнює наш authMiddleware. Тепер req.user типізований у всьому проєкті.
declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

export {};
