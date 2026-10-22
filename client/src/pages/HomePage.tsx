import { useState } from 'react';
import { Navigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { FolderPlus } from 'lucide-react';
import { projectsApi } from '../api/projects';
import { ProjectModal } from '../components/ProjectModal';
import { Spinner } from '../components/Spinner';

// Головна: якщо є проєкти — відкриваємо перший, інакше пропонуємо створити
export function HomePage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data: projects, isLoading } = useQuery({ queryKey: ['projects'], queryFn: projectsApi.list });

  if (isLoading) return <div className="grid h-full place-items-center"><Spinner /></div>;
  if (projects?.length) return <Navigate to={`/projects/${projects[0].id}`} replace />;

  return (
    <div className="grid h-full place-items-center p-8">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-accent/15">
          <FolderPlus className="size-7 text-accent" />
        </div>
        <h2 className="text-xl font-semibold">Створи свій перший проєкт</h2>
        <p className="mt-2 text-sm text-muted">
          Проєкти допомагають групувати задачі: «Робота», «Навчання», «Пет-проєкт»…
        </p>
        <button className="btn-primary mt-6" onClick={() => setShowCreate(true)}>Новий проєкт</button>
      </div>
      {showCreate && <ProjectModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
