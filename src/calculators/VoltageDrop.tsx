'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, TrendingDown } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

// AWG resistance in Ω/km (copper) at 20°C
const AWG_RESISTANCE: Record<string, { resistance: number; label: string; diameter: number }> = {
  '4': { resistance: 0.8152, label: 'AWG 4 (5.19mm)', diameter: 5.189 },
  '6': { resistance: 1.296, label: 'AWG 6 (4.11mm)', diameter: 4.115 },
  '8': { resistance: 2.061, label: 'AWG 8 (3.26mm)', diameter: 3.264 },
  '10': { resistance: 3.277, label: 'AWG 10 (2.59mm)', diameter: 2.588 },
  '12': { resistance: 5.211, label: 'AWG 12 (2.05mm)', diameter: 2.053 },
  '14': { resistance: 8.286, label: 'AWG 14 (1.63mm)', diameter: 1.628 },
  '16': { resistance: 13.17, label: 'AWG 16 (1.29mm)', diameter: 1.291 },
  '18': { resistance: 20.95, label: 'AWG 18 (1.02mm)', diameter: 1.024 },
  '20': { resistance: 33.31, label: 'AWG 20 (0.81mm)', diameter: 0.812 },
  '22': { resistance: 52.96, label: 'AWG 22 (0.64mm)', diameter: 0.644 },
  '24': { resistance: 84.21, label: 'AWG 24 (0.51mm)', diameter: 0.511 },
  '26': { resistance: 133.9, label: 'AWG 26 (0.40mm)', diameter: 0.405 },
};

const MATERIAL_FACTOR: Record<string, { label: string; factor: number }> = {
  copper: { label: 'Copper', factor: 1.0 },
  aluminum: { label: 'Aluminum', factor: 1.64 },
  gold: { label: 'Gold', factor: 1.45 },
};

export function VoltageDropCalculator() {
  const [awg, setAwg] = useState('12');
  const [material, setMaterial] = useState('copper');
  const [length, setLength] = useState('');
  const [current, setCurrent] = useState('');
  const [voltage, setVoltage] = useState('');
  const [result, setResult] = useState<{
    drop: string; dropPct: string; wireR: string; powerLoss: string
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    const L_m = parseFloat(length);
    const I = parseFloat(current);
    const Vs = parseFloat(voltage);
    setError('');

    if (isNaN(L_m) || L_m <= 0) return setError('Enter a valid wire length.');
    if (isNaN(I) || I <= 0) return setError('Enter a valid current.');

    const { resistance } = AWG_RESISTANCE[awg];
    const mat = MATERIAL_FACTOR[material];
    // Round trip (×2), resistance in Ω/km → Ω/m (/1000)
    const R_total = (resistance * mat.factor / 1000) * L_m * 2;
    const Vdrop = I * R_total;
    const Ploss = Vdrop * I;

    const dropPct = !isNaN(Vs) && Vs > 0 ? formatNumber((Vdrop / Vs) * 100, 2) : '—';

    setResult({
      drop: formatNumber(Vdrop, 4),
      dropPct,
      wireR: formatNumber(R_total, 4),
      powerLoss: formatNumber(Ploss, 3),
    });

    addHistory({
      calculatorId: 'voltage-drop',
      calculatorTitle: 'Voltage Drop Calculator',
      inputs: { AWG: awg, length: L_m, current: I, voltage: Vs },
      result: `Vdrop = ${formatNumber(Vdrop, 4)} V`,
    });
  }, [awg, material, length, current, voltage]);

  const reset = () => { setLength(''); setCurrent(''); setVoltage(''); setResult(null); setError(''); };

  const awgOptions = Object.entries(AWG_RESISTANCE).map(([k, v]) => ({ value: k, label: v.label }));
  const matOptions = Object.entries(MATERIAL_FACTOR).map(([k, v]) => ({ value: k, label: v.label }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text">
          <TrendingDown size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Voltage Drop Calculator</h2>
          <p className="text-sm text-classic-muted">Calculate voltage drop along a wire run</p>
        </div>
      </div>

      <FormulaDisplay
        formula="Vdrop = I × R_wire   (round-trip)"
        description="Voltage drop in both conductors (positive + return)"
        variables={[
          { symbol: 'Vdrop', description: 'Voltage drop', unit: 'V' },
          { symbol: 'I', description: 'Current', unit: 'A' },
          { symbol: 'R', description: 'Wire resistance (round-trip)', unit: 'Ω' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput label="Wire Gauge (AWG)" value={awg} onChange={setAwg} options={awgOptions} />
        <SelectInput label="Conductor Material" value={material} onChange={setMaterial} options={matOptions} />
        <NumberInput label="One-Way Wire Length" value={length} onChange={setLength} unit="m" placeholder="e.g. 10" />
        <NumberInput label="Load Current" value={current} onChange={setCurrent} unit="A" placeholder="e.g. 5" />
        <NumberInput label="Supply Voltage (optional)" value={voltage} onChange={setVoltage} unit="V" placeholder="e.g. 12" />
      </div>

      {error && <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3">{error}</div>}

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 py-2.5 px-6 bg-classic-accent text-classic-accent-text font-bold text-sm hover:bg-classic-accent-hover transition-colors border border-classic-border">
          Calculate
        </button>
        <button onClick={reset} className="p-2.5 bg-classic-panel border border-classic-border text-classic-muted hover:text-classic-text transition-colors" title="Reset">
          <RefreshCw size={18} />
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-2 gap-3">
          <ResultBox label="Voltage Drop" value={result.drop} unit="V" highlight />
          <ResultBox label="Drop Percentage" value={result.dropPct === '—' ? null : result.dropPct} unit="%" />
          <ResultBox label="Wire Resistance (round-trip)" value={result.wireR} unit="Ω" />
          <ResultBox label="Power Loss in Wire" value={result.powerLoss} unit="W" />
        </div>
      )}
    </div>
  );
}
