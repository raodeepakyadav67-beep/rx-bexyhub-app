import type { ReactNode } from 'react';

interface ClinicalPearlProps {
  title?: string;
  children: ReactNode;
}

export function ClinicalPearl({ title = "Deepak Kumar's ICU Bedside Realities", children }: ClinicalPearlProps) {
  return (
    <div className="mt-5 rounded-2xl border border-amber-300/40 bg-amber-50/80 p-4 dark:border-amber-400/20 dark:bg-amber-500/[0.07]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {title}
          </h4>
          <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/80">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
