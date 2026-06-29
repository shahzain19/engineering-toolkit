'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

type SolveFor = 'fos' | 'working' | 'failure';

export function FactorOfSafetyCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>('fos');
  const [failureLoad, setFailureLoad] = useState('');
  const [workingLoad, setWorkingLoad] = useState('');
  const [fos, setFos] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'safe' | 'borderline' | 'unsafe' | null>(null);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    setError('');
    let res: number;

    if (solveFor === 'fos') {
      const Ff = parseFloat(failureLoad);
      const Fw = parseFloat(workingLoad);
      if (isNaN(Ff) || isNaN(Fw)) return setError('Enter both failure load and working load.');
      if (Fw <= 0) return setError('Working load must be positive.');
      res = Ff / Fw;
      const r = formatNumber(res, 3);
      setResult(r);
      setStatus(res >= 2 ? 'safe' : res >= 1 ? 'borderline' : 'unsafe');
      addHistory({ calculatorId: 'factor-of-safety', calculatorTitle: 'Factor of Safety', inputs: { Ff, Fw }, result: `FoS = ${r}` });
    } else if (solveFor === 'working') {
      const Ff = parseFloat(failureLoad);
      const F = parseFloat(fos);
      if (isNaN(Ff) || isNaN(F)) return setError('Enter failure load and factor of safety.');
      if (F <= 0) return setError('Factor of safety must be positive.');
      res = Ff / F;
      const r = formatNumber(res, 3);
      setResult(r);
      setStatus(null);
      addHistory({ calculatorId: 'factor-of-safety', calculatorTitle: 'Factor of Safety', inputs: { Ff, FoS: F }, result: `Working Load = ${r}` });
    } else {
      const Fw = parseFloat(workingLoad);
      const F = parseFloat(fos);
      if (isNaN(Fw) || isNaN(F)) return setError('Enter working load and factor of safety.');
      if (Fw <= 0 || F <= 0) return setError('Values must be positive.');
      res = Fw * F;
      const r = formatNumber(res, 3);
      setResult(r);
      setStatus(null);
      addHistory({ calculatorId: 'factor-of-safety', calculatorTitle: 'Factor of Safety', inputs: { Fw, FoS: F }, result: `Failure Load = ${r}` });
    }
  }, [solveFor, failureLoad, workingLoad, fos]);

  const reset = () => { setFailureLoad(''); setWorkingLoad(''); setFos(''); setResult(null); setStatus(null); setError(''); };

  const solveOptions: { value: SolveFor; label: string }[] = [
    { value: 'fos', label: 'Factor of Safety' },
    { value: 'working', label: 'Max Working Load' },
    { value: 'failure', label: 'Min Failure Load' },
  ];

  const resultLabel = solveFor === 'fos' ? 'Factor of Safety' : solveFor === 'working' ? 'Max Working Load' : 'Required Failure Load';
  const resultUnit = solveFor === 'fos' ? '' : 'N';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Factor of Safety Calculator</h2>
          <p className="text-sm text-classic-muted">Structural safety analysis</p>
        </div>
      </div>

      <FormulaDisplay
        formula="FoS = Failure Load / Working Load"
        description="Factor of Safety — how many times stronger than required"
        variables={[
          { symbol: 'FoS', description: 'Factor of Safety (dimensionless)' },
          { symbol: 'Ff', description: 'Failure / Ultimate load', unit: 'N' },
          { symbol: 'Fw', description: 'Working / Applied load', unit: 'N' },
        ]}
      />

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Solve For</p>
        <div className="grid grid-cols-3 gap-2">
          {solveOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setSolveFor(opt.value); setResult(null); setError(''); setStatus(null); }}
              className={`py-2 px-3 text-sm font-medium border transition-colors ${
                solveFor === opt.value
                  ? 'bg-classic-accent text-classic-accent-text border-classic-accent'
                  : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text hover:border-classic-border'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {solveFor !== 'failure' && (
          <NumberInput label="Failure / Ultimate Load (Ff)" value={failureLoad} onChange={setFailureLoad} unit="N" placeholder="e.g. 10000" />
        )}
        {solveFor === 'failure' && (
          <NumberInput label="Working / Applied Load (Fw)" value={workingLoad} onChange={setWorkingLoad} unit="N" placeholder="e.g. 2500" />
        )}
        {solveFor !== 'working' && solveFor !== 'failure' && (
          <NumberInput label="Working / Applied Load (Fw)" value={workingLoad} onChange={setWorkingLoad} unit="N" placeholder="e.g. 2500" />
        )}
        {solveFor !== 'fos' && (
          <NumberInput label="Factor of Safety (FoS)" value={fos} onChange={setFos} placeholder="e.g. 2.5" />
        )}
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

      <ResultBox label={resultLabel} value={result} unit={resultUnit} highlight={result !== null} />

      {status && result && (
        <div className={`px-4 py-3 border text-sm font-semibold ${
          status === 'safe' ? 'bg-green-50 border-green-200 text-green-700' :
          status === 'borderline' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
          'bg-red-50 border-red-200 text-red-700'
        }`}>
          {status === 'safe' ? '✓ SAFE — FoS ≥ 2.0 (acceptable for most structural applications)' :
           status === 'borderline' ? '⚠ BORDERLINE — FoS 1.0–2.0 (may be insufficient; review loading assumptions)' :
           '✗ UNSAFE — FoS < 1.0 (structure will fail under working load)'}
        </div>
      )}

      {/* FoS Reference */}
      <div className="border border-classic-border bg-classic-bg p-4">
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-3">Typical FoS Values</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { app: 'Aircraft structures', fos: '1.25–1.5' },
            { app: 'Pressure vessels', fos: '3.5–4.0' },
            { app: 'Bridges (static)', fos: '3.0–4.0' },
            { app: 'General machinery', fos: '2.0–3.0' },
            { app: 'Buildings (live loads)', fos: '2.0–2.5' },
            { app: 'Lifting equipment', fos: '5.0–8.0' },
          ].map((row) => (
            <div key={row.app} className="flex justify-between gap-2 border-b border-classic-border pb-1">
              <span className="text-classic-muted">{row.app}</span>
              <span className="font-mono text-classic-text font-semibold">{row.fos}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
