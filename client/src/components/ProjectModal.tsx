import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import { projectsApi } from '../api/projects';
import { Modal } from './Modal';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#a855f7', '#64748b'];

export function ProjectModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  // useMutation — для запитів, що ЗМІНЮЮТЬ дані (POST/PATCH/DELETE)
  const createProject = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: (project) => {
      // кажемо React Query: "список проєктів застарів — перезавантаж"
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onClose();
      navigate(`/projects/${project.id}`);
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createProject.mutate({ name, description: description || undefined, color });
  }

  return (
    <Modal title="Новий проєкт" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Назва</label>
          <input className="input" placeholder="Наприклад, Робота" value={name}
            onChange={(e) => setName(e.target.value)} required autoFocus maxLength={100} />
        </div>
        <div>
          <label className="label">Опис</label>
          <textarea className="input min-h-20 resize-none" placeholder="Необов'язково"
            value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
        </div>
        <div>
          <label className="label">Колір</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)}
                className={clsx('size-7 rounded-full transition', color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface' : 'opacity-70 hover:opacity-100')}
                style={{ backgroundColor: c }} aria-label={c} />
            ))}
          </div>
        </div>
        {createProject.error && <p className="text-sm text-rose-400">{createProject.error.message}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Скасувати</button>
          <button type="submit" className="btn-primary" disabled={createProject.isPending}>Створити</button>
        </div>
      </form>
    </Modal>
  );
}
