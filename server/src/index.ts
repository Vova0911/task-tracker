import { app } from './app.js';
import { env } from './config/env.js';

// Точка входу: тільки запускаємо сервер на порту.
app.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`);
});
