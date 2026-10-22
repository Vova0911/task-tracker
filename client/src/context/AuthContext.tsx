import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi } from '../api/auth';
import { tokenStorage } from '../api/client';
import type { User } from '../api/types';

// Context — "глобальна змінна" для React: будь-який компонент може
// дізнатися, хто залогінений, викликавши useAuth()

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // При старті: якщо є збережений токен — питаємо бекенд "хто я?"
  useEffect(() => {
    if (!tokenStorage.get()) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => tokenStorage.clear())
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { user, token } = await authApi.login({ email, password });
    tokenStorage.set(token);
    setUser(user);
  }

  async function register(email: string, name: string, password: string) {
    const { user, token } = await authApi.register({ email, name, password });
    tokenStorage.set(token);
    setUser(user);
  }

  function logout() {
    tokenStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
