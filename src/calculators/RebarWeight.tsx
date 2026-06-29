'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Layers } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { formatNumber, addHistory } from '@/utils/storage';

// Rebar weight per meter (kg/m) — standard deformed bars
const REBAR_SIZES: { value: string; label: string; kgPerM: number; dia: number }[] = [
  { value: 'r6', label: 'Ø6 mm', kgPerM: 0.222, dia: 6 },
  { value: 'r8', label: 'Ø8 mm', kgPerM: 0.395, dia: 8 },
  { value: 'r10', label: 'Ø10 mm', kgPerM: 0.617, dia: 10 },
  { value: 'r12', label: 'Ø12 mm', kgPerM: 0.888, dia: 12 },
  { value: 'r14', label: 'Ø14 mm', kgPerM: 1.208, dia: 14 },
  { value: 'r16', label: 'Ø16 mm', kgPerM: 1.578, dia: 16 },
  { value: 'r20', label: 'Ø20 mm', kgPerM: 2.466, dia: 20 },
  { value: 'r25', label: 'Ø25 mm', kgPerM: 3.853, dia: 25 },
  { value: 'r32', label: 'Ø32 mm', kgPerM: 6.313, dia: 32 },
  { value: 'r40', label: 'Ø40 mm', kgPerM: 9.865, dia: 40 },
  // Imperial
  { value: '#3', label: '#3 (3/8") — US', kgPerM: 0.560, dia: 9.525 },
  { value: '#4', label: '#4 (1/2") — US', kgPerM: 0.994, dia: 12.7 },
  { value: '#5', label: '#5 (5/8") — US', kgPerM: 1.552, dia: 15.875 },
  { value: '#6', label: '#6 (3/4") — US', kgPerM: 2.235, dia: 19.05 },
  { value: '#8', label: '#8 (1") — US', kgPerM: 3.973, dia: 25.4 },
];

export function RebarWeightCalculator() {
  const [size, setSize] = useState('r12');
  const [barLength, setBarLength] = useState('');
  const [quantity, setQuantity] = useState('');
  const [result, setResult] = useState<{ totalWeight: string; weightPerBar: string; totalLength: string } | null>(null);
  const [error, setError] = useState('');

  const sizeOptions = REBAR_SIZES.map(r => ({ value: r.value, label: r.label }));

  const calculate = useCallback(() => {
    setError('');
    const L = parseFloat(barLength);
    const qty = parseInt(quantity);
    const rebar = REBAR_SIZES.find(r => r.value === size);
    if (!rebar) return;
    if (isNaN(L) || L <= 0) return setError('Enter a valid bar length (m).');
    if (isNaN(qty) || qty <= 0) return setError('Enter a valid quantity.');

    const weightPerBar = rebar.kgPerM * L;
    const totalWeight = weightPerBar * qty;
    const totalLength = L * qty;

    setResult({
      totalWeight: formatNumber(totalWeight, 3),
      weightPerBar: formatNumber(weightPerBar, 3),
      totalLength: formatNumber(totalLength, 2),
    });

    addHistory({
      calculatorId: 'rebar-weight',
      calculatorTitle: 'Rebar Weight Calculator',
      inputs: { size: rebar.label, length: L, quantity: qty },
      result: `Total = ${formatNumber(totalWeight, 3)} kg`,
    });
  }, [size, barLength, quantity]);

  const reset = () => { setBarLength(''); setQuantity(''); setResult(null); setError(''); };
  const selected = REBAR_SIZES.find(r => r.value === size);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Layers size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Rebar Weight Calculator</h2>
          <p className="text-sm text-classic-muted">Calculate total weight of reinforcing bars</p>
        </div>
      </div>

      <div className="bg-classic-bg border border-classic-border p-3 text-xs text-classic-muted">
        Formula: Weight = (π/4) × d² × 7850 × L &nbsp;·&nbsp; Based on steel density 7850 kg/m³
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput label="Rebar Size" value={size} onChange={setSize} options={sizeOptions} />
        {selected && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Unit Weight</label>
            <div className="px-2 py-1.5 bg-classic-bg border border-classic-border text-classic-accent font-mono text-sm">
              {selected.kgPerM} kg/m
            </div>
          </div>
        )}
        <NumberInput label="Bar Length" value={barLength} onChange={setBarLength} unit="m" placeholder="e.g. 6" />
        <NumberInput label="Quantity" value={quantity} onChange={setQuantity} placeholder="e.g. 50" />
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ResultBox label="Total Weight" value={result.totalWeight} unit="kg" highlight />
          <ResultBox label="Weight per Bar" value={result.weightPerBar} unit="kg" />
          <ResultBox label="Total Length" value={result.totalLength} unit="m" />
        </div>
      )}

      {/* Full reference table */}
      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Rebar Unit Weight Reference</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-classic-border bg-classic-input">
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">Size</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">Diameter (mm)</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">kg/m</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">kg/6m bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-classic-border">
              {REBAR_SIZES.map((r) => (
                <tr key={r.value} className={`hover:bg-classic-input transition-colors cursor-pointer ${size === r.value ? 'bg-classic-input' : ''}`}
                    onClick={() => setSize(r.value)}>
                  <td className="px-3 py-2 font-mono text-classic-accent">{r.label}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-muted">{r.dia}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-text">{r.kgPerM}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-muted">{(r.kgPerM * 6).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
