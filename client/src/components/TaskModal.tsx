import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { tasksApi, type TaskInput } from '../api/tasks';
import type { Task, TaskPriority, TaskStatus } from '../api/types';
import { Modal } from './Modal';
import { PRIORITIES, STATUSES } from './taskMeta';

interface TaskModalProps {
  projectId: number;
  task?: Task;                 // є task -> редагування, немає -> створення
  defaultStatus?: TaskStatus;
  onClose: () => void;
}

export function TaskModal({ projectId, task, defaultStatus = 'TODO', onClose }: TaskModalProps) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(task);

  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? defaultStatus,
    priority: task?.priority ?? ('MEDIUM' as TaskPriority),
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    queryClient.invalidateQueries({ queryKey: ['projects'] }); // лічильник задач у сайдбарі
  };

  const save = useMutation({
    mutationFn: (body: TaskInput) => (task ? tasksApi.update(task.id, body) : tasksApi.create(projectId, body)),
    onSuccess: () => { refresh(); onClose(); },
  });

  const remove = useMutation({
    mutationFn: () => tasksApi.remove(task!.id),
    onSuccess: () => { refresh(); onClose(); },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    save.mutate({
      title: form.title,
      description: form.description || undefined,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
    });
  }

  return (
    <Modal title={isEdit ? 'Редагувати задачу' : 'Нова задача'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Назва</label>
          <input className="input" value={form.title} required autoFocus maxLength={200}
            placeholder="Що треба зробити?" onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="label">Опис</label>
          <textarea className="input min-h-24 resize-none" value={form.description} maxLength={2000}
            placeholder="Деталі (необов'язково)" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Статус</label>
            <select className="input" value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
              {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Пріоритет</label>
            <select className="input" value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}>
              {Object.entries(PRIORITIES).map(([id, p]) => <option key={id} value={id}>{p.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Дедлайн</label>
          <input type="date" className="input [color-scheme:dark]" value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </div>

        {save.error && <p className="text-sm text-rose-400">{save.error.message}</p>}

        <div className="flex items-center gap-2 pt-2">
          {isEdit && (
            <button type="button" className="btn-ghost text-rose-400 hover:text-rose-300"
              onClick={() => remove.mutate()} disabled={remove.isPending}>
              <Trash2 className="size-4" /> Видалити
            </button>
          )}
          <div className="flex-1" />
          <button type="button" className="btn-ghost" onClick={onClose}>Скасувати</button>
          <button type="submit" className="btn-primary" disabled={save.isPending}>
            {isEdit ? 'Зберегти' : 'Створити'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
