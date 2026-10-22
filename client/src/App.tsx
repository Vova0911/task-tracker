import { BrowserRouter, Route, Routes } from 'react-router';
import { AppLayout } from './components/AppLayout';
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute';
import { BoardPage } from './pages/BoardPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Карта сторінок застосунку
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* тільки для НЕзалогінених */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* тільки для залогінених */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:id" element={<BoardPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
