import type { ReactNode } from 'react';
import { CheckSquare } from 'lucide-react';

// Спільна обгортка для сторінок входу і реєстрації
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="relative grid min-h-full place-items-center overflow-hidden p-4">
      {/* декоративне світіння на фоні */}
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-accent shadow-lg shadow-accent/30">
            <CheckSquare className="size-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface/80 p-6 shadow-xl backdrop-blur">
          {children}
        </div>
      </div>
    </div>
  );
}
