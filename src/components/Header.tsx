import { Activity } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { usePwaInstall } from '@/hooks/usePwaInstall';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Header({ theme, toggleTheme }: HeaderProps) {
  const { canInstall, promptInstall } = usePwaInstall();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/80 backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-950/80">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow-sm">
          <Activity className="h-5 w-5" strokeWidth={2.5} />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-400 ring-2 ring-white dark:ring-ink-950" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-ink-900 dark:text-white sm:text-lg">
              Bexyhub<span className="text-brand-500"> ICU</span>
            </span>
            <span className="hidden rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 sm:inline-block">
              Clinical Intelligence
            </span>
          </div>
          <p className="truncate text-[11px] font-medium text-ink-500 dark:text-ink-400">
            icu.bexyhub.in · ICU Nursing &amp; Medical Suite
          </p>
        </div>
        {canInstall && (
          <button
            type="button"
            onClick={promptInstall}
            className="hidden items-center gap-1.5 rounded-lg bg-brand-500/10 px-3 py-2 text-xs font-semibold text-brand-600 transition hover:bg-brand-500/20 active:scale-95 dark:text-brand-400 sm:inline-flex"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
            </svg>
            Install
          </button>
        )}
        <ThemeToggle theme={theme} toggle={toggleTheme} />
      </div>
    </header>
  );
}
