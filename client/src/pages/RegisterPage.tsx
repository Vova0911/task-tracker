import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { ApiError } from '../api/client';
import { AuthLayout } from '../components/AuthLayout';
import { FieldError } from '../components/FieldError';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Один об'єкт state для всієї форми
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // Універсальний обробник: name інпута = ключ у form
  function update(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      await register(form.email, form.name, form.password);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errors ? '' : err.message);
        setFieldErrors(err.errors ?? {}); // помилки zod з бекенду -> під полями
      } else {
        setError('Помилка мережі');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Створи акаунт" subtitle="Почни керувати своїми задачами">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">Ім'я</label>
          <input id="name" name="name" className="input" placeholder="Denis"
            value={form.name} onChange={update} required autoFocus />
          <FieldError messages={fieldErrors.name} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" placeholder="you@example.com"
            value={form.email} onChange={update} required />
          <FieldError messages={fieldErrors.email} />
        </div>
        <div>
          <label className="label" htmlFor="password">Пароль</label>
          <input id="password" name="password" type="password" className="input" placeholder="Мінімум 8 символів"
            value={form.password} onChange={update} required />
          <FieldError messages={fieldErrors.password} />
        </div>

        {error && (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Створюємо…' : 'Зареєструватися'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Вже є акаунт?{' '}
        <Link to="/login" className="font-medium text-accent hover:text-accent-hover">
          Увійти
        </Link>
      </p>
    </AuthLayout>
  );
}
