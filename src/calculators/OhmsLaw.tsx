'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

type SolveFor = 'voltage' | 'current' | 'resistance';

interface Fields {
  voltage: string;
  current: string;
  resistance: string;
}

const initialFields: Fields = { voltage: '', current: '', resistance: '' };

export function OhmsLawCalculator() {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [solveFor, setSolveFor] = useState<SolveFor>('voltage');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const setField = (key: keyof Fields) => (val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
    setResult(null);
    setError('');
  };

  const calculate = useCallback(() => {
    const V = parseFloat(fields.voltage);
    const I = parseFloat(fields.current);
    const R = parseFloat(fields.resistance);
    setError('');

    try {
      let res: number;
      if (solveFor === 'voltage') {
        if (isNaN(I) || isNaN(R)) return setError('Enter current (A) and resistance (Ω).');
        if (R < 0) return setError('Resistance cannot be negative.');
        res = I * R;
        const r = formatNumber(res);
        setResult(r);
        addHistory({ calculatorId: 'ohms-law', calculatorTitle: "Ohm's Law", inputs: { I, R }, result: `V = ${r} V` });
      } else if (solveFor === 'current') {
        if (isNaN(V) || isNaN(R)) return setError('Enter voltage (V) and resistance (Ω).');
        if (R === 0) return setError('Resistance cannot be zero (division by zero).');
        res = V / R;
        const r = formatNumber(res);
        setResult(r);
        addHistory({ calculatorId: 'ohms-law', calculatorTitle: "Ohm's Law", inputs: { V, R }, result: `I = ${r} A` });
      } else {
        if (isNaN(V) || isNaN(I)) return setError('Enter voltage (V) and current (A).');
        if (I === 0) return setError('Current cannot be zero (division by zero).');
        res = V / I;
        const r = formatNumber(res);
        setResult(r);
        addHistory({ calculatorId: 'ohms-law', calculatorTitle: "Ohm's Law", inputs: { V, I }, result: `R = ${r} Ω` });
      }
    } catch {
      setError('Invalid calculation.');
    }
  }, [fields, solveFor]);

  const reset = () => {
    setFields(initialFields);
    setResult(null);
    setError('');
  };

  const resultUnit = solveFor === 'voltage' ? 'V' : solveFor === 'current' ? 'A' : 'Ω';
  const resultLabel = solveFor === 'voltage' ? 'Voltage' : solveFor === 'current' ? 'Current' : 'Resistance';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-yellow-500/15 text-yellow-400">
          <Zap size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Ohm's Law Calculator</h2>
          <p className="text-sm text-slate-400">Solve for voltage, current, or resistance</p>
        </div>
      </div>

      <FormulaDisplay
        formula="V = I × R"
        description="Voltage equals Current multiplied by Resistance"
        variables={[
          { symbol: 'V', description: 'Voltage', unit: 'Volts (V)' },
          { symbol: 'I', description: 'Current', unit: 'Amperes (A)' },
          { symbol: 'R', description: 'Resistance', unit: 'Ohms (Ω)' },
        ]}
      />

      {/* Solve For selector */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Solve For</p>
        <div className="grid grid-cols-3 gap-2">
          {(['voltage', 'current', 'resistance'] as SolveFor[]).map((mode) => (
            <button
              key={mode}
              onClick={() => { setSolveFor(mode); setResult(null); setError(''); }}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                solveFor === mode
                  ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-4">
        <NumberInput
          label="Voltage (V)"
          value={fields.voltage}
          onChange={setField('voltage')}
          unit="V"
          placeholder={solveFor === 'voltage' ? '← will be calculated' : '0'}
          disabled={solveFor === 'voltage'}
        />
        <NumberInput
          label="Current (I)"
          value={fields.current}
          onChange={setField('current')}
          unit="A"
          placeholder={solveFor === 'current' ? '← will be calculated' : '0'}
          disabled={solveFor === 'current'}
        />
        <NumberInput
          label="Resistance (R)"
          value={fields.resistance}
          onChange={setField('resistance')}
          unit="Ω"
          placeholder={solveFor === 'resistance' ? '← will be calculated' : '0'}
          disabled={solveFor === 'resistance'}
        />
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 font-bold text-sm hover:from-yellow-400 hover:to-amber-400 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30"
        >
          Calculate
        </button>
        <button
          onClick={reset}
          className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all duration-200"
          title="Reset"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <ResultBox
        label={`Calculated ${resultLabel}`}
        value={result}
        unit={resultUnit}
        highlight={result !== null}
      />
    </div>
  );
}
