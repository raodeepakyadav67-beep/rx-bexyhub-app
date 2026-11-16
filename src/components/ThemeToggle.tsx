import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggle: () => void;
}

export function ThemeToggle({ theme, toggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-700 transition-all hover:border-brand-400 hover:text-brand-600 active:scale-95 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200 dark:hover:border-brand-500 dark:hover:text-brand-400"
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        }`}
      />
    </button>
  );
}
