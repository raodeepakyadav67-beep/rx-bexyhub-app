import { useMemo, useState } from 'react';
import { Droplets, Calculator, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { ClinicalPearl } from './ClinicalPearl';

type DrugId = 'noradrenaline' | 'adrenaline' | 'dobutamine' | 'vasopressin';
type SolveMode = 'rate' | 'dose';

interface DrugPreset {
  id: DrugId;
  name: string;
  shortName: string;
  defaultConcentration: string;
  concentrationUnit: string;
  concentrationLabel: string;
  defaultDose: string;
  doseUnit: string;
  typicalRange: string;
  color: string;
  vasoactive: boolean;
  formulaNote: string;
}

const DRUGS: DrugPreset[] = [
  {
    id: 'noradrenaline',
    name: 'Noradrenaline (Norepinephrine)',
    shortName: 'Noradrenaline',
    defaultConcentration: '4',
    concentrationUnit: 'mg/50ml',
    concentrationLabel: 'Concentration (mg in 50 ml)',
    defaultDose: '0.1',
    doseUnit: 'mcg/kg/min',
    typicalRange: '0.05–1.0 mcg/kg/min',
    color: 'sky',
    vasoactive: true,
    formulaNote: 'Rate = (dose × wt × 50) / (conc_mg × 1000) × 60',
  },
  {
    id: 'adrenaline',
    name: 'Adrenaline (Epinephrine)',
    shortName: 'Adrenaline',
    defaultConcentration: '4',
    concentrationUnit: 'mg/50ml',
    concentrationLabel: 'Concentration (mg in 50 ml)',
    defaultDose: '0.05',
    doseUnit: 'mcg/kg/min',
    typicalRange: '0.05–0.5 mcg/kg/min',
    color: 'rose',
    vasoactive: true,
    formulaNote: 'Rate = (dose × wt × 50) / (conc_mg × 1000) × 60',
  },
  {
    id: 'dobutamine',
    name: 'Dobutamine',
    shortName: 'Dobutamine',
    defaultConcentration: '250',
    concentrationUnit: 'mg/50ml',
    concentrationLabel: 'Concentration (mg in 50 ml)',
    defaultDose: '5',
    doseUnit: 'mcg/kg/min',
    typicalRange: '2–20 mcg/kg/min',
    color: 'amber',
    vasoactive: true,
    formulaNote: 'Rate = (dose × wt × 50) / (conc_mg × 1000) × 60',
  },
  {
    id: 'vasopressin',
    name: 'Vasopressin',
    shortName: 'Vaspressin',
    defaultConcentration: '20',
    concentrationUnit: 'U/50ml',
    concentrationLabel: 'Concentration (U in 50 ml)',
    defaultDose: '0.03',
    doseUnit: 'U/min',
    typicalRange: '0.01–0.04 U/min',
    color: 'violet',
    vasoactive: true,
    formulaNote: 'Rate = (dose × 50) / conc_U',
  },
];

function num(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function calcRate(drug: DrugPreset, weight: number, dose: number, conc: number): number {
  if (drug.id === 'vasopressin') {
    if (conc <= 0) return 0;
    return (dose * 50) / conc;
  }
  if (conc <= 0) return 0;
  return (dose * weight * 50) / (conc * 1000) * 60;
}

function calcDose(drug: DrugPreset, weight: number, rate: number, conc: number): number {
  if (drug.id === 'vasopressin') {
    if (conc <= 0) return 0;
    return (rate * conc) / 50;
  }
  if (conc <= 0 || weight <= 0) return 0;
  return (rate * conc * 1000) / (weight * 50 * 60);
}

export function VasoactiveCalculator() {
  const [drugId, setDrugId] = useState<DrugId>('noradrenaline');
  const [mode, setMode] = useState<SolveMode>('rate');
  const [weight, setWeight] = useState('70');
  const [concentration, setConcentration] = useState('4');
  const [dose, setDose] = useState('0.1');
  const [rate, setRate] = useState('15');

  const drug = DRUGS.find((d) => d.id === drugId)!;

  const selectDrug = (id: DrugId) => {
    const next = DRUGS.find((d) => d.id === id)!;
    setDrugId(id);
    setConcentration(next.defaultConcentration);
    setDose(next.defaultDose);
  };

  const result = useMemo(() => {
    const wt = num(weight);
    const conc = num(concentration);
    if (mode === 'rate') {
      const d = num(dose);
      const r = calcRate(drug, wt, d, conc);
      return { value: r, unit: 'ml/hr', label: drug.id === 'vasopressin' ? 'Infusion Rate' : 'Infusion Rate' };
    }
    const rt = num(rate);
    const dv = calcDose(drug, wt, rt, conc);
    return { value: dv, unit: drug.doseUnit, label: 'Calculated Dose' };
  }, [drug, mode, weight, concentration, dose, rate]);

  const weightNeeded = drug.id !== 'vasopressin';
  const formatted = result.value > 0 ? (result.value < 1 ? result.value.toFixed(3) : result.value < 10 ? result.value.toFixed(2) : result.value.toFixed(1)) : '0';

  return (
    <section className="animate-fade-in-up rounded-3xl border border-ink-200/70 bg-white p-5 shadow-sm sm:p-6 dark:border-ink-800/70 dark:bg-ink-900/50">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Droplets className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink-900 dark:text-white sm:text-xl">Vasoactive Infusion Calculator</h2>
          <p className="text-xs text-ink-500 dark:text-ink-400">Noradrenaline · Adrenaline · Dobutamine · Vasopressin</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DRUGS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => selectDrug(d.id)}
            className={`rounded-xl border px-3 py-2.5 text-center text-xs font-semibold transition-all active:scale-95 ${
              drugId === d.id
                ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300 shadow-glow-sm'
                : 'border-ink-200 bg-ink-50 text-ink-600 hover:border-ink-300 dark:border-ink-700 dark:bg-ink-800/50 dark:text-ink-300 dark:hover:border-ink-600'
            }`}
          >
            {d.shortName}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Patient Weight" unit="kg" value={weight} onChange={setWeight} disabled={!weightNeeded} />
        <Field label={drug.concentrationLabel} unit="" value={concentration} onChange={setConcentration} />
      </div>

      <div className="mt-4 inline-flex rounded-xl border border-ink-200 bg-ink-50 p-1 dark:border-ink-700 dark:bg-ink-800/50">
        <button
          type="button"
          onClick={() => setMode('rate')}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            mode === 'rate' ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-700 dark:text-white' : 'text-ink-500 dark:text-ink-400'
          }`}
        >
          <Calculator className="h-3.5 w-3.5" /> Solve Rate
        </button>
        <button
          type="button"
          onClick={() => setMode('dose')}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            mode === 'dose' ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-700 dark:text-white' : 'text-ink-500 dark:text-ink-400'
          }`}
        >
          <ArrowRightLeft className="h-3.5 w-3.5" /> Solve Dose
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {mode === 'rate' ? (
          <Field label={`Desired Dose (${drug.doseUnit})`} unit={drug.doseUnit} value={dose} onChange={setDose} />
        ) : (
          <Field label="Current Infusion Rate" unit="ml/hr" value={rate} onChange={setRate} />
        )}
        <div className="flex flex-col justify-center rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-brand-600/5 px-4 py-3 dark:border-brand-500/30">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">{result.label}</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tabular-nums text-ink-900 dark:text-white">{formatted}</span>
            <span className="text-sm font-semibold text-ink-500 dark:text-ink-400">{result.unit}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-2 dark:bg-ink-800/40">
        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-ink-400" />
        <p className="text-[11px] text-ink-500 dark:text-ink-400">
          Typical range: <span className="font-semibold text-ink-700 dark:text-ink-200">{drug.typicalRange}</span>
        </p>
      </div>

      <ClinicalPearl>
        {drugId === 'noradrenaline' && (
          <>
            <p>• First-line vasopressor in septic shock — titrate to MAP ≥ 65 mmHg, not to a number on the pump.</p>
            <p>• Central line is mandatory; peripheral extravasation causes skin necrosis. Keep phentolamine drawn up if running peripherally.</p>
            <p>• Reassess every 5–10 min in unstable shock; the pump rate is a snapshot, not a destination.</p>
          </>
        )}
        {drugId === 'adrenaline' && (
          <>
            <p>• Reserve for refractory shock or anaphylaxis; it raises lactate via glycolysis — a rising lactate on adrenaline is not always worsening perfusion.</p>
            <p>• Arrhythmogenic at higher doses; check for new AF or ectopy before each titration.</p>
            <p>• Shifts potassium into cells — watch for hypokalaemia on prolonged infusion.</p>
          </>
        )}
        {drugId === 'dobutamine' && (
          <>
            <p>• Tachyphylaxis within 24–48 h; plan weaning early, don't let it run for days unquestioned.</p>
            <p>• Causes tachycardia and can worsen myocardial ischaemia in borderline coronary disease — watch the HR, not just the BP.</p>
            <p>• Often raises lactate slightly via pyruvate flux; trend clinically, don't chase one number.</p>
          </>
        )}
        {drugId === 'vasopressin' && (
          <>
            <p>• Fixed-dose add-on (0.03 U/min) in septic shock — it is not titrated like catecholamines. Do not uptitrate.</p>
            <p>• Check finger circulation every shift — mesenteric/digital ischaemia is the feared bedside complication.</p>
            <p>• Reduces catecholamine requirements; when noradrenaline comes down, stop vasopressin first to avoid rebound hypotension.</p>
          </>
        )}
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
}

function Field({ label, unit, value, onChange, disabled }: FieldProps) {
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
          placeholder="0"
        />
        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink-400">{unit}</span>
        )}
      </div>
    </label>
  );
}
