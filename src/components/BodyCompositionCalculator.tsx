import { useMemo, useState } from 'react';
import { Ruler, User, UserRound } from 'lucide-react';
import { ClinicalPearl } from './ClinicalPearl';

type Gender = 'male' | 'female';

function num(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function navyBodyFat(g: Gender, h: number, waist: number, neck: number, hip: number): number {
  if (g === 'male') {
    const diff = waist - neck;
    if (diff <= 0 || h <= 0) return 0;
    return 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(h)) - 450;
  }
  const diff = waist + hip - neck;
  if (diff <= 0 || h <= 0) return 0;
  return 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.22100 * Math.log10(h)) - 450;
}

function bmi(w: number, h: number): number {
  if (h <= 0) return 0;
  return w / Math.pow(h / 100, 2);
}

function vai(g: Gender, wc: number, bmiVal: number, tg: number, hdl: number): number {
  if (tg <= 0 || hdl <= 0) return 0;
  if (g === 'male') {
    const denom = 39.68 + 1.88 * bmiVal;
    if (denom <= 0) return 0;
    return (wc / denom) * (tg / 1.03) * (1.31 / hdl);
  }
  const denom = 36.02 + 1.91 * bmiVal;
  if (denom <= 0) return 0;
  return (wc / denom) * (tg / 0.81) * (1.52 / hdl);
}

function bfCategory(g: Gender, bf: number): { label: string; tone: 'ok' | 'warn' | 'high' } {
  if (g === 'male') {
    if (bf < 25) return { label: 'Optimal / Low', tone: 'ok' };
    if (bf < 32) return { label: 'Moderate', tone: 'warn' };
    return { label: 'High', tone: 'high' };
  }
  if (bf < 31) return { label: 'Optimal / Low', tone: 'ok' };
  if (bf < 39) return { label: 'Moderate', tone: 'warn' };
  return { label: 'High', tone: 'high' };
}

function bmiCategory(b: number): { label: string; tone: 'ok' | 'warn' | 'high' } {
  if (b < 18.5) return { label: 'Underweight', tone: 'warn' };
  if (b < 25) return { label: 'Normal', tone: 'ok' };
  if (b < 30) return { label: 'Overweight', tone: 'warn' };
  if (b < 35) return { label: 'Obese I', tone: 'high' };
  if (b < 40) return { label: 'Obese II', tone: 'high' };
  return { label: 'Obese III', tone: 'high' };
}

function vaiCategory(v: number): { label: string; tone: 'ok' | 'warn' | 'high' } {
  if (v <= 0) return { label: '—', tone: 'ok' };
  if (v < 1.0) return { label: 'Low visceral fat', tone: 'ok' };
  if (v < 2.0) return { label: 'Moderate', tone: 'warn' };
  return { label: 'High cardiometabolic risk', tone: 'high' };
}

export function BodyCompositionCalculator() {
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [waist, setWaist] = useState('85');
  const [neck, setNeck] = useState('38');
  const [hip, setHip] = useState('95');
  const [tg, setTg] = useState('');
  const [hdl, setHdl] = useState('');

  const results = useMemo(() => {
    const w = num(weight);
    const h = num(height);
    const wc = num(waist);
    const nc = num(neck);
    const hp = num(hip);
    const bmiVal = bmi(w, h);
    const bf = navyBodyFat(gender, h, wc, nc, hp);
    const v = vai(gender, wc, bmiVal, num(tg), num(hdl));
    return { bmi: bmiVal, bf, vai: v };
  }, [gender, weight, height, waist, neck, hip, tg, hdl]);

  const fmt = (n: number, d = 1) => (n > 0 ? n.toFixed(d) : '—');
  const bfCat = bfCategory(gender, results.bf);
  const bmiCat = bmiCategory(results.bmi);
  const vaiCat = vaiCategory(results.vai);

  return (
    <section className="animate-fade-in-up rounded-3xl border border-ink-200/70 bg-white p-5 shadow-sm sm:p-6 dark:border-ink-800/70 dark:bg-ink-900/50">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <Ruler className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink-900 dark:text-white sm:text-xl">Body Fat &amp; Visceral Adipose Index</h2>
          <p className="text-xs text-ink-500 dark:text-ink-400">Navy circumference method + Amato VAI · anthropometric metabolic risk</p>
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
        <div className="grid grid-cols-2 gap-3">
          <Field label="Weight" unit="kg" value={weight} onChange={setWeight} />
          <Field label="Height" unit="cm" value={height} onChange={setHeight} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Waist" unit="cm" value={waist} onChange={setWaist} />
        <Field label="Neck" unit="cm" value={neck} onChange={setNeck} />
        <Field label="Hip" unit="cm" value={hip} onChange={setHip} disabled={gender === 'male'} />
      </div>

      <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50/60 p-3.5 dark:border-ink-800 dark:bg-ink-800/30">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Optional — for Visceral Adipose Index (VAI)
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-3">
          <Field label="Triglycerides" unit="mmol/L" value={tg} onChange={setTg} optional />
          <Field label="HDL Cholesterol" unit="mmol/L" value={hdl} onChange={setHdl} optional />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <ResultCard
          label="Body Fat"
          value={fmt(results.bf, 1)}
          unit="%"
          sub={bfCat.label}
          tone={bfCat.tone}
          highlight
        />
        <ResultCard label="BMI" value={fmt(results.bmi, 1)} unit="kg/m²" sub={bmiCat.label} tone={bmiCat.tone} />
        <ResultCard label="VAI" value={fmt(results.vai, 2)} unit="" sub={vaiCat.label} tone={vaiCat.tone} />
      </div>

      <ClinicalPearl>
        <p>• Navy circumference body fat is a field estimate, not DEXA — it overestimates lean athletes and underestimates visceral fat in older patients. Use it to track trends, not to make a single-call diagnosis.</p>
        <p>• Hip circumference is required for the female formula (waist + hip − neck). On males the hip field disables and the formula uses waist − neck only.</p>
        <p>• VAI &gt; 2.0 correlates with incident diabetes and cardiovascular events independent of BMI — a slim-looking patient with a high VAI still carries cardiometabolic risk.</p>
        <p>• WHR (waist-to-hip) is not shown here, but a waist &gt; 94 cm in men or &gt; 80 cm in women flags central adiposity worth investigating further.</p>
        <p>• Triglycerides and HDL must be in mmol/L for the VAI formula. If your lab reports mg/dL, divide TG by 88.5 and HDL by 38.7 before entering.</p>
      </ClinicalPearl>
    </section>
  );
}

interface FieldProps {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  optional?: boolean;
}

function Field({ label, unit, value, onChange, disabled, optional }: FieldProps) {
  return (
    <label className={`block ${disabled ? 'opacity-50' : ''}`}>
      <span className="mb-1.5 block text-xs font-semibold text-ink-600 dark:text-ink-300">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-semibold tabular-nums text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          placeholder={optional ? 'optional' : '0'}
        />
        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-ink-400">{unit}</span>
        )}
      </div>
    </label>
  );
}

const toneClass: Record<'ok' | 'warn' | 'high', string> = {
  ok: 'text-brand-600 dark:text-brand-400 bg-brand-500/10 border-brand-500/30',
  warn: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
  high: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30',
};

interface ResultCardProps {
  label: string;
  value: string;
  unit: string;
  sub: string;
  tone: 'ok' | 'warn' | 'high';
  highlight?: boolean;
}

function ResultCard({ label, value, unit, sub, tone, highlight }: ResultCardProps) {
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
        <span className={`font-mono text-2xl font-bold tabular-nums ${highlight ? 'text-brand-600 dark:text-brand-400' : 'text-ink-900 dark:text-white'}`}>
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-ink-500 dark:text-ink-400">{unit}</span>}
      </div>
      <span className={`mt-1.5 inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold ${toneClass[tone]}`}>{sub}</span>
    </div>
  );
}
