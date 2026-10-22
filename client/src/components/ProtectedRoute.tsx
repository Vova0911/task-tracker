import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Spinner } from './Spinner';

// Пускає далі тільки залогінених. Інакше — редірект на /login
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="grid h-full place-items-center">
        <Spinner />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Навпаки: залогінених з /login і /register відправляє на головну
export function GuestRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
