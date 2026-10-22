import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { ApiError } from '../api/client';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // "Контрольовані" інпути: значення зберігаємо в state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); // не перезавантажувати сторінку
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Помилка мережі');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="З поверненням" subtitle="Увійди, щоб продовжити">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </div>
        <div>
          <label className="label" htmlFor="password">Пароль</label>
          <input id="password" type="password" className="input" placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Входимо…' : 'Увійти'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Немає акаунта?{' '}
        <Link to="/register" className="font-medium text-accent hover:text-accent-hover">
          Зареєструватися
        </Link>
      </p>
    </AuthLayout>
  );
}
