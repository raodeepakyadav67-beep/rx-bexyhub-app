import { ShieldCheck, Zap, HeartPulse } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink-200/70 bg-gradient-to-br from-ink-900 via-ink-900 to-brand-950 p-6 text-white sm:p-8 dark:border-ink-800/70">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-300 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
          </span>
          Bedside Decision Support
        </div>
        <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl">
          ICU Clinical Intelligence Suite
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">
          Lightning-fast vasoactive infusion and ventilation calculators with bedside clinical pearls — built for ICU nursing officers and medical professionals.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Pill icon={<Zap className="h-3.5 w-3.5" />} text="Real-time calculation" />
          <Pill icon={<ShieldCheck className="h-3.5 w-3.5" />} text="Lung-protective ARDSNet" />
          <Pill icon={<HeartPulse className="h-3.5 w-3.5" />} text="4 vasopressors" />
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-ink-100 backdrop-blur">
      <span className="text-brand-300">{icon}</span>
      {text}
    </span>
  );
}
