'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Settings } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

export function GearRatioCalculator() {
  const [driverTeeth, setDriverTeeth] = useState('');
  const [drivenTeeth, setDrivenTeeth] = useState('');
  const [inputRPM, setInputRPM] = useState('');
  const [results, setResults] = useState<{ ratio: string; outputRPM: string } | null>(null);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    const driver = parseFloat(driverTeeth);
    const driven = parseFloat(drivenTeeth);
    const rpm = parseFloat(inputRPM);
    setError('');

    if (isNaN(driver) || isNaN(driven)) return setError('Enter both driver and driven gear teeth.');
    if (driver <= 0 || driven <= 0) return setError('Gear teeth must be positive integers.');

    const ratio = driven / driver;
    const outputRPM = isNaN(rpm) ? null : rpm / ratio;

    const r = formatNumber(ratio, 4);
    const rpmStr = outputRPM !== null ? formatNumber(outputRPM, 2) : 'N/A';

    setResults({ ratio: r, outputRPM: rpmStr });
    addHistory({
      calculatorId: 'gear-ratio',
      calculatorTitle: 'Gear Ratio Calculator',
      inputs: { driver, driven, inputRPM: rpm },
      result: `Ratio = ${r}:1, Output RPM = ${rpmStr}`,
    });
  }, [driverTeeth, drivenTeeth, inputRPM]);

  const reset = () => { setDriverTeeth(''); setDrivenTeeth(''); setInputRPM(''); setResults(null); setError(''); };

  const ratio = parseFloat(driverTeeth) > 0 && parseFloat(drivenTeeth) > 0
    ? parseFloat(drivenTeeth) / parseFloat(driverTeeth)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400"><Settings size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Gear Ratio Calculator</h2>
          <p className="text-sm text-slate-400">Calculate gear ratio and output speed</p>
        </div>
      </div>

      <FormulaDisplay
        formula="Ratio = Driven / Driver"
        description="Output RPM = Input RPM / Gear Ratio"
        variables={[
          { symbol: 'GR', description: 'Gear Ratio', unit: ':1' },
          { symbol: 'Nd', description: 'Driver gear teeth (input)' },
          { symbol: 'Nr', description: 'Driven gear teeth (output)' },
        ]}
      />

      {/* Gear visualization */}
      <div className="flex items-center justify-center gap-4 py-3">
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-full border-4 border-blue-400/60 bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-300"
            style={{ boxShadow: '0 0 15px rgba(59,130,246,0.2)' }}
          >
            {driverTeeth || '?'}T
          </div>
          <span className="text-xs text-slate-500">Driver</span>
        </div>
        <div className="text-slate-600">⚙</div>
        <div className="flex flex-col items-center gap-2">
          <div
            className="border-4 border-cyan-400/60 bg-cyan-500/10 rounded-full flex items-center justify-center text-xs font-bold text-cyan-300"
            style={{
              width: ratio ? `${Math.min(Math.max(ratio * 40, 40), 100)}px` : '64px',
              height: ratio ? `${Math.min(Math.max(ratio * 40, 40), 100)}px` : '64px',
              boxShadow: '0 0 15px rgba(6,182,212,0.2)',
              transition: 'all 0.3s ease',
            }}
          >
            {drivenTeeth || '?'}T
          </div>
          <span className="text-xs text-slate-500">Driven</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <NumberInput label="Driver Gear Teeth (Input)" value={driverTeeth} onChange={setDriverTeeth} placeholder="e.g. 20" />
        <NumberInput label="Driven Gear Teeth (Output)" value={drivenTeeth} onChange={setDrivenTeeth} placeholder="e.g. 60" />
        <NumberInput label="Input RPM (optional)" value={inputRPM} onChange={setInputRPM} unit="RPM" placeholder="e.g. 1500" />
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

      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ResultBox label="Gear Ratio" value={`${results.ratio}:1`} highlight />
          <ResultBox label="Output RPM" value={results.outputRPM !== 'N/A' ? results.outputRPM : null} unit="RPM" />
        </div>
      )}

      {results && (
        <div className="rounded-xl bg-slate-800/40 border border-slate-700 p-4 text-sm">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Interpretation</p>
          {parseFloat(results.ratio) > 1 ? (
            <p className="text-slate-400">Speed <span className="text-red-400">reduction</span> — Torque is <span className="text-green-400">multiplied</span> by {results.ratio}×</p>
          ) : parseFloat(results.ratio) < 1 ? (
            <p className="text-slate-400">Speed <span className="text-green-400">increase</span> — Torque is <span className="text-red-400">reduced</span></p>
          ) : (
            <p className="text-slate-400">1:1 ratio — no speed or torque change</p>
          )}
        </div>
      )}
    </div>
  );
}
