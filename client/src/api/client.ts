// Базовий HTTP-клієнт: одна функція для ВСІХ запитів до бекенду.
// Автоматично додає токен і перетворює помилки сервера на ApiError.

const TOKEN_KEY = 'tt_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>, // помилки валідації по полях (від zod)
  ) {
    super(message);
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();

  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // 204 No Content — тіла немає
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // токен протух — виходимо
    if (res.status === 401 && token) {
      tokenStorage.clear();
      window.location.href = '/login';
    }
    throw new ApiError(res.status, data.message ?? 'Щось пішло не так', data.errors);
  }

  return data as T;
}
