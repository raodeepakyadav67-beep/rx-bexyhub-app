export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-200/70 bg-white/50 py-8 dark:border-ink-800/70 dark:bg-ink-950/50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h4l3-9 4 18 3-9h4" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-ink-800 dark:text-ink-100">Bexyhub ICU Suite</p>
              <p className="text-[11px] text-ink-500 dark:text-ink-400">icu.bexyhub.in</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p className="text-xs font-medium text-ink-600 dark:text-ink-300">
              Clinical content by <span className="font-bold text-ink-800 dark:text-white">Deepak Kumar</span>
            </p>
            <p className="text-[11px] text-ink-500 dark:text-ink-400">
              ISNI <span className="font-mono tracking-wider">0000 0005 3044 0565</span>
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-ink-200/60 bg-ink-50/60 px-4 py-3 dark:border-ink-800/60 dark:bg-ink-900/40">
          <p className="text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">
            <strong className="font-semibold text-ink-700 dark:text-ink-300">Disclaimer:</strong> This tool is a clinical decision-support aid for trained ICU professionals, not a substitute for clinical judgment. Always verify dosing against institutional protocols and pharmacy references. Calculations are based on standard formulae; individual patient factors may require adjustment.
          </p>
        </div>
      </div>
    </footer>
  );
}
