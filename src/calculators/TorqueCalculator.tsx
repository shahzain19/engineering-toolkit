'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

const FORCE_UNITS = [
  { value: 'N', label: 'Newtons (N)' },
  { value: 'kN', label: 'Kilonewtons (kN)' },
  { value: 'lbf', label: 'Pound-force (lbf)' },
  { value: 'kgf', label: 'Kilogram-force (kgf)' },
];

const DISTANCE_UNITS = [
  { value: 'm', label: 'Meters (m)' },
  { value: 'mm', label: 'Millimeters (mm)' },
  { value: 'cm', label: 'Centimeters (cm)' },
  { value: 'ft', label: 'Feet (ft)' },
  { value: 'in', label: 'Inches (in)' },
];

const forceToN: Record<string, number> = { N: 1, kN: 1000, lbf: 4.44822, kgf: 9.80665 };
const distToM: Record<string, number> = { m: 1, mm: 0.001, cm: 0.01, ft: 0.3048, in: 0.0254 };

export function TorqueCalculator() {
  const [force, setForce] = useState('');
  const [distance, setDistance] = useState('');
  const [forceUnit, setForceUnit] = useState('N');
  const [distUnit, setDistUnit] = useState('m');
  const [result, setResult] = useState<{ Nm: string; Nmm: string; ftlb: string } | null>(null);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    const F = parseFloat(force);
    const d = parseFloat(distance);
    setError('');

    if (isNaN(F) || isNaN(d)) return setError('Enter force and distance values.');
    if (d < 0) return setError('Distance must be positive.');

    const F_N = F * forceToN[forceUnit];
    const d_m = d * distToM[distUnit];
    const torque_Nm = F_N * d_m;

    const res = {
      Nm: formatNumber(torque_Nm, 4),
      Nmm: formatNumber(torque_Nm * 1000, 2),
      ftlb: formatNumber(torque_Nm * 0.737562, 4),
    };

    setResult(res);
    addHistory({
      calculatorId: 'torque-calculator',
      calculatorTitle: 'Torque Calculator',
      inputs: { F, forceUnit, d, distUnit },
      result: `τ = ${res.Nm} N·m`,
    });
  }, [force, distance, forceUnit, distUnit]);

  const reset = () => { setForce(''); setDistance(''); setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400"><RotateCcw size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Torque Calculator</h2>
          <p className="text-sm text-slate-400">Calculate rotational force</p>
        </div>
      </div>

      <FormulaDisplay
        formula="τ = F × d"
        description="Torque equals Force multiplied by moment arm Distance"
        variables={[
          { symbol: 'τ', description: 'Torque (Tau)', unit: 'N·m' },
          { symbol: 'F', description: 'Applied Force', unit: 'N' },
          { symbol: 'd', description: 'Distance (moment arm)', unit: 'm' },
        ]}
      />

      {/* Visual */}
      <div className="flex items-center justify-center py-2">
        <svg viewBox="0 0 200 100" className="w-full max-w-xs h-24 text-slate-400">
          <line x1="40" y1="50" x2="160" y2="50" stroke="#475569" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="40" cy="50" r="8" fill="none" stroke="#3b82f6" strokeWidth="2"/>
          <line x1="160" y1="20" x2="160" y2="50" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"/>
          <polygon points="155,22 160,8 165,22" fill="#22d3ee" opacity="0.9"/>
          <text x="100" y="70" textAnchor="middle" fill="#64748b" fontSize="10">d = {distance || '?'} {distUnit}</text>
          <text x="165" y="35" textAnchor="start" fill="#22d3ee" fontSize="9">F = {force || '?'} {forceUnit}</text>
          <text x="40" y="74" textAnchor="middle" fill="#3b82f6" fontSize="9">Pivot</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput label="Force" value={force} onChange={setForce} placeholder="e.g. 100" />
        <SelectInput label="Force Unit" value={forceUnit} onChange={setForceUnit} options={FORCE_UNITS} />
        <NumberInput label="Moment Arm Distance" value={distance} onChange={setDistance} placeholder="e.g. 0.5" />
        <SelectInput label="Distance Unit" value={distUnit} onChange={setDistUnit} options={DISTANCE_UNITS} />
      </div>

      {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</div>}

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm hover:from-blue-400 hover:to-cyan-400 transition-all duration-200 shadow-lg shadow-blue-500/20">
          Calculate
        </button>
        <button onClick={reset} className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all duration-200">
          <RefreshCw size={18} />
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-3">
          <ResultBox label="Torque (Newton·meters)" value={result.Nm} unit="N·m" highlight />
          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="Torque (N·mm)" value={result.Nmm} unit="N·mm" />
            <ResultBox label="Torque (ft·lbf)" value={result.ftlb} unit="ft·lb" />
          </div>
        </div>
      )}
    </div>
  );
}
