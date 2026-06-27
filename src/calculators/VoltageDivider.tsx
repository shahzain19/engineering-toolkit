'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, SplitSquareVertical } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

interface Fields {
  vin: string;
  r1: string;
  r2: string;
}

export function VoltageDividerCalculator() {
  const [fields, setFields] = useState<Fields>({ vin: '', r1: '', r2: '' });
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const setField = (key: keyof Fields) => (val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
    setResult(null);
    setError('');
  };

  const calculate = useCallback(() => {
    const Vin = parseFloat(fields.vin);
    const R1 = parseFloat(fields.r1);
    const R2 = parseFloat(fields.r2);
    setError('');

    if (isNaN(Vin) || isNaN(R1) || isNaN(R2)) return setError('Please fill all three fields.');
    if (R1 < 0 || R2 < 0) return setError('Resistance values must be non-negative.');
    if (R1 + R2 === 0) return setError('Total resistance cannot be zero.');

    const Vout = Vin * (R2 / (R1 + R2));
    const r = formatNumber(Vout);
    setResult(r);

    const ratio = formatNumber((R2 / (R1 + R2)) * 100, 2);
    addHistory({
      calculatorId: 'voltage-divider',
      calculatorTitle: 'Voltage Divider',
      inputs: { Vin, R1, R2 },
      result: `Vout = ${r} V (${ratio}% of input)`,
    });
  }, [fields]);

  const reset = () => { setFields({ vin: '', r1: '', r2: '' }); setResult(null); setError(''); };

  const Vout = result !== null ? parseFloat(result) : null;
  const Vin = parseFloat(fields.vin);
  const R1 = parseFloat(fields.r1);
  const R2 = parseFloat(fields.r2);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-yellow-500/15 text-yellow-400">
          <SplitSquareVertical size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Voltage Divider</h2>
          <p className="text-sm text-slate-400">Calculate output voltage from two resistors</p>
        </div>
      </div>

      <FormulaDisplay
        formula="Vout = Vin × R2 / (R1 + R2)"
        variables={[
          { symbol: 'Vout', description: 'Output Voltage', unit: 'V' },
          { symbol: 'Vin', description: 'Input Voltage', unit: 'V' },
          { symbol: 'R1', description: 'Resistor 1 (top)', unit: 'Ω' },
          { symbol: 'R2', description: 'Resistor 2 (bottom)', unit: 'Ω' },
        ]}
      />

      {/* Visual diagram */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-0 text-slate-400 text-xs font-mono">
          <div className="flex flex-col items-center">
            <span className="text-slate-300 font-semibold">Vin = {fields.vin || '?'} V</span>
            <div className="w-px h-4 bg-slate-600" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-slate-600" />
            <div className="px-3 py-1.5 rounded-md bg-slate-800 border border-slate-600 text-slate-300">R1 = {fields.r1 || '?'} Ω</div>
            <div className="w-8 h-px bg-slate-600" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-slate-600" />
            <div className="flex flex-col items-center">
              <div className="w-px h-3 bg-slate-600" />
              <span className="text-cyan-400 font-semibold">Vout = {result ?? '?'} V</span>
              <div className="w-px h-3 bg-slate-600" />
            </div>
            <div className="w-8 h-px bg-slate-600" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-slate-600" />
            <div className="px-3 py-1.5 rounded-md bg-slate-800 border border-slate-600 text-slate-300">R2 = {fields.r2 || '?'} Ω</div>
            <div className="w-8 h-px bg-slate-600" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-px h-4 bg-slate-600" />
            <span className="text-slate-500">GND</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <NumberInput label="Input Voltage (Vin)" value={fields.vin} onChange={setField('vin')} unit="V" />
        <NumberInput label="Resistor R1 (top)" value={fields.r1} onChange={setField('r1')} unit="Ω" />
        <NumberInput label="Resistor R2 (bottom)" value={fields.r2} onChange={setField('r2')} unit="Ω" />
      </div>

      {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</div>}

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 font-bold text-sm hover:from-yellow-400 hover:to-amber-400 transition-all duration-200 shadow-lg shadow-yellow-500/20">
          Calculate
        </button>
        <button onClick={reset} className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all duration-200" title="Reset">
          <RefreshCw size={18} />
        </button>
      </div>

      <ResultBox label="Output Voltage (Vout)" value={result} unit="V" highlight={result !== null} />

      {result !== null && !isNaN(Vin) && !isNaN(R1) && !isNaN(R2) && (
        <div className="grid grid-cols-2 gap-3">
          <ResultBox
            label="Voltage Drop Ratio"
            value={formatNumber((Vout! / Vin) * 100, 2)}
            unit="%"
          />
          <ResultBox
            label="Current Through Divider"
            value={formatNumber(Vin / (R1 + R2) * 1000, 4)}
            unit="mA"
          />
        </div>
      )}
    </div>
  );
}
