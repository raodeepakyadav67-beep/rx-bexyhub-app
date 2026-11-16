import { useMemo, useState } from 'react';
import { Wind, User, UserRound } from 'lucide-react';
import { ClinicalPearl } from './ClinicalPearl';

type Gender = 'male' | 'female';

function num(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function pbw(gender: Gender, heightCm: number): number {
  return gender === 'male'
    ? 50 + 0.91 * (heightCm - 152.4)
    : 45.5 + 0.91 * (heightCm - 152.4);
}

export function VentilationCalculator() {
  const [gender, setGender] = useState<Gender>('male');
  const [height, setHeight] = useState('170');
  const [targetRR, setTargetRR] = useState('18');

  const h = num(height);

  const results = useMemo(() => {
    const pbwKg = pbw(gender, h);
    const tv = 6 * pbwKg;
    const peep = gender === 'male' ? 5 : 5;
    const minuteVolTarget = 7;
    const rr = num(targetRR) > 0 ? num(targetRR) : Math.max(12, Math.round(minuteVolTarget / (tv / 1000)));
    const minuteVol = (tv / 1000) * rr;

    const maleTV4 = 4 * pbwKg;
    const maleTV8 = 8 * pbwKg;

    return {
      pbw: pbwKg,
      tv,
      tvLow: maleTV4,
      tvHigh: maleTV8,
      peep,
      rr,
      minuteVol,
    };
  }, [gender, h, targetRR]);

  const fmt = (n: number, d = 0) => (n > 0 ? n.toFixed(d) : '—');

  return (
    <section className="animate-fade-in-up rounded-3xl border border-ink-200/70 bg-white p-5 shadow-sm sm:p-6 dark:border-ink-800/70 dark:bg-ink-900/50">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
          <Wind className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink-900 dark:text-white sm:text-xl">Mechanical Ventilation Settings</h2>
          <p className="text-xs text-ink-500 dark:text-ink-400">Lung-protective initial settings from PBW (ARDESNet)</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-ink-600 dark:text-ink-300">Sex</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                gender === 'male'
                  ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300 shadow-glow-sm'
                  : 'border-ink-200 bg-ink-50 text-ink-600 hover:border-ink-300 dark:border-ink-700 dark:bg-ink-800/50 dark:text-ink-300'
              }`}
            >
              <User className="h-4 w-4" /> Male
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                gender === 'female'
                  ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 shadow-glow-sm'
                  : 'border-ink-200 bg-ink-50 text-ink-600 hover:border-ink-300 dark:border-ink-700 dark:bg-ink-800/50 dark:text-ink-300'
              }`}
            >
              <UserRound className="h-4 w-4" /> Female
            </button>
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-600 dark:text-ink-300">Height (cm)</span>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-semibold tabular-nums text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
              placeholder="170"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink-400">cm</span>
          </div>
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-ink-200 bg-ink-50/60 p-4 dark:border-ink-800 dark:bg-ink-800/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">Predicted Body Weight</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-bold tabular-nums text-ink-900 dark:text-white">{fmt(results.pbw, 1)}</span>
            <span className="text-xs font-medium text-ink-500">kg</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <ResultCard label="Tidal Volume" value={fmt(results.tv, 0)} unit="ml" sub="6 ml/kg PBW" highlight />
        <ResultCard label="PEEP" value={`${fmt(results.peep, 0)}`} unit="cmH₂O" sub="starting" />
        <ResultCard label="Resp. Rate" value={fmt(results.rr, 0)} unit="/min" sub="initial target" />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <MiniStat label="Minute Ventilation" value={fmt(results.minuteVol, 1)} unit="L/min" />
        <MiniStat label="TV Range (4–8 ml/kg)" value={`${fmt(results.tvLow, 0)}–${fmt(results.tvHigh, 0)}`} unit="ml" />
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold text-ink-600 dark:text-ink-300">Adjust target RR (optional)</span>
        <div className="relative max-w-[12rem]">
          <input
            type="number"
            inputMode="numeric"
            step="1"
            min="0"
            value={targetRR}
            onChange={(e) => setTargetRR(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-semibold tabular-nums text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
            placeholder="auto"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink-400">/min</span>
        </div>
      </label>

      <ClinicalPearl>
        <p>• PBW ≠ actual weight. Use height to set PBW — giving 6 ml/kg of actual weight to an obese patient overventilates them.</p>
        <p>• Start Vt 6 ml/kg PBW; titrate down toward 4 ml/kg if plateau pressure &gt; 30 cmH₂O. Driving pressure (ΔP) &lt; 15 is a better bedside target than Vt alone.</p>
        <p>• PEEP 5 is a floor, not a destination. In ARDS, titrate with FiO₂ using a PEEP/FiO₂ table; in pure COPD, a bit higher to combat intrinsic PEEP.</p>
        <p>• RR is for CO₂ clearance — aim for pH 7.30–7.45, not a "normal" PaCO₂. Permissive hypercapnia is acceptable in lung-protective ventilation.</p>
        <p>• Always verify the ventilator's delivered Vt after setting — tubing compliance and circuit leaks change what the patient actually receives.</p>
      </ClinicalPearl>
    </section>
  );
}

function ResultCard({ label, value, unit, sub, highlight }: { label: string; value: string; unit: string; sub: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? 'border-brand-500/40 bg-gradient-to-br from-brand-500/10 to-brand-600/5 dark:border-brand-500/30'
          : 'border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-800/50'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className={`font-mono text-2xl font-bold tabular-nums ${highlight ? 'text-brand-600 dark:text-brand-400' : 'text-ink-900 dark:text-white'}`}>{value}</span>
        <span className="text-xs font-medium text-ink-500 dark:text-ink-400">{unit}</span>
      </div>
      <p className="mt-0.5 text-[11px] text-ink-400 dark:text-ink-500">{sub}</p>
    </div>
  );
}

function MiniStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-200 bg-ink-50/60 px-3.5 py-2.5 dark:border-ink-700 dark:bg-ink-800/30">
      <span className="text-xs font-medium text-ink-600 dark:text-ink-300">{label}</span>
      <span className="font-mono text-sm font-bold tabular-nums text-ink-900 dark:text-white">
        {value} <span className="text-[11px] font-medium text-ink-400">{unit}</span>
      </span>
    </div>
  );
}
