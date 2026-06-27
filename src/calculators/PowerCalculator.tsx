'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Battery } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

type SolveFor = 'power' | 'voltage' | 'current';

interface Fields { power: string; voltage: string; current: string }

export function PowerCalculator() {
  const [fields, setFields] = useState<Fields>({ power: '', voltage: '', current: '' });
  const [solveFor, setSolveFor] = useState<SolveFor>('power');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const setField = (key: keyof Fields) => (val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
    setResult(null); setError('');
  };

  const calculate = useCallback(() => {
    const P = parseFloat(fields.power);
    const V = parseFloat(fields.voltage);
    const I = parseFloat(fields.current);
    setError('');
    let res: number;
    if (solveFor === 'power') {
      if (isNaN(V) || isNaN(I)) return setError('Enter voltage and current.');
      res = V * I;
    } else if (solveFor === 'voltage') {
      if (isNaN(P) || isNaN(I)) return setError('Enter power and current.');
      if (I === 0) return setError('Current cannot be zero.');
      res = P / I;
    } else {
      if (isNaN(P) || isNaN(V)) return setError('Enter power and voltage.');
      if (V === 0) return setError('Voltage cannot be zero.');
      res = P / V;
    }
    const r = formatNumber(res);
    setResult(r);
    const labels = { power: 'P', voltage: 'V', current: 'I' };
    const units = { power: 'W', voltage: 'V', current: 'A' };
    addHistory({
      calculatorId: 'power-calculator',
      calculatorTitle: 'Power Calculator',
      inputs: { P, V, I },
      result: `${labels[solveFor]} = ${r} ${units[solveFor]}`,
    });
  }, [fields, solveFor]);

  const reset = () => { setFields({ power: '', voltage: '', current: '' }); setResult(null); setError(''); };

  const labels = { power: 'Power (P)', voltage: 'Voltage (V)', current: 'Current (I)' };
  const units = { power: 'W', voltage: 'V', current: 'A' };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-yellow-500/15 text-yellow-400"><Battery size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Power Calculator</h2>
          <p className="text-sm text-slate-400">Calculate power, voltage, or current</p>
        </div>
      </div>

      <FormulaDisplay
        formula="P = V × I"
        variables={[
          { symbol: 'P', description: 'Power', unit: 'Watts (W)' },
          { symbol: 'V', description: 'Voltage', unit: 'Volts (V)' },
          { symbol: 'I', description: 'Current', unit: 'Amperes (A)' },
        ]}
      />

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Solve For</p>
        <div className="grid grid-cols-3 gap-2">
          {(['power', 'voltage', 'current'] as SolveFor[]).map((mode) => (
            <button key={mode} onClick={() => { setSolveFor(mode); setResult(null); setError(''); }}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 border ${solveFor === mode ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'}`}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {(['power', 'voltage', 'current'] as SolveFor[]).map((key) => (
          <NumberInput
            key={key}
            label={labels[key]}
            value={fields[key]}
            onChange={setField(key)}
            unit={units[key]}
            placeholder={solveFor === key ? '← will be calculated' : '0'}
            disabled={solveFor === key}
          />
        ))}
      </div>

      {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</div>}

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 font-bold text-sm hover:from-yellow-400 hover:to-amber-400 transition-all duration-200 shadow-lg shadow-yellow-500/20">
          Calculate
        </button>
        <button onClick={reset} className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all duration-200">
          <RefreshCw size={18} />
        </button>
      </div>

      <ResultBox
        label={`Calculated ${labels[solveFor].split(' ')[0]}`}
        value={result}
        unit={units[solveFor]}
        highlight={result !== null}
      />

      {/* Additional derived formulas */}
      {result !== null && (
        <div className="rounded-xl bg-slate-800/40 border border-slate-700 p-4 text-sm text-slate-400 space-y-2">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Related Formulas</p>
          <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
            <div className="flex gap-2"><span className="text-cyan-400">P = V²/R</span><span className="text-slate-500">—</span><span>Power from voltage & resistance</span></div>
            <div className="flex gap-2"><span className="text-cyan-400">P = I²×R</span><span className="text-slate-500">—</span><span>Power from current & resistance</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
