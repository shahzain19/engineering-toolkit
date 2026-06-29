'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

export function KineticPotentialEnergyCalculator() {
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [height, setHeight] = useState('');
  const [gravity, setGravity] = useState('9.80665');
  const [result, setResult] = useState<{
    KE: string; PE: string; total: string; KE_kJ: string; PE_kJ: string;
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    setError('');
    const m = parseFloat(mass);
    const v = parseFloat(velocity);
    const h = parseFloat(height);
    const g = parseFloat(gravity);

    if (isNaN(m) || m <= 0) return setError('Enter a valid mass (kg).');
    if (isNaN(g) || g <= 0) return setError('Enter a valid gravitational acceleration.');

    const hasV = !isNaN(v);
    const hasH = !isNaN(h);

    if (!hasV && !hasH) return setError('Enter at least velocity or height to calculate energy.');

    const KE = hasV ? 0.5 * m * v * v : 0;
    const PE = hasH ? m * g * h : 0;
    const total = KE + PE;

    setResult({
      KE: formatNumber(KE, 4),
      PE: formatNumber(PE, 4),
      total: formatNumber(total, 4),
      KE_kJ: formatNumber(KE / 1000, 6),
      PE_kJ: formatNumber(PE / 1000, 6),
    });

    addHistory({
      calculatorId: 'kinetic-potential-energy',
      calculatorTitle: 'KE & PE Calculator',
      inputs: { mass: m, velocity: v, height: h },
      result: `KE=${formatNumber(KE, 3)} J, PE=${formatNumber(PE, 3)} J, Total=${formatNumber(total, 3)} J`,
    });
  }, [mass, velocity, height, gravity]);

  const reset = () => { setMass(''); setVelocity(''); setHeight(''); setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Zap size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Kinetic & Potential Energy Calculator</h2>
          <p className="text-sm text-classic-muted">Calculate KE = ½mv² and PE = mgh</p>
        </div>
      </div>

      <FormulaDisplay
        formula="KE = ½mv²    PE = mgh"
        variables={[
          { symbol: 'KE', description: 'Kinetic energy', unit: 'J' },
          { symbol: 'PE', description: 'Potential energy', unit: 'J' },
          { symbol: 'm', description: 'Mass', unit: 'kg' },
          { symbol: 'v', description: 'Velocity', unit: 'm/s' },
          { symbol: 'g', description: 'Gravity', unit: 'm/s²' },
          { symbol: 'h', description: 'Height', unit: 'm' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput label="Mass (m)" value={mass} onChange={setMass} unit="kg" placeholder="e.g. 5" />
        <NumberInput label="Velocity (v) — for KE" value={velocity} onChange={setVelocity} unit="m/s" placeholder="e.g. 10" />
        <NumberInput label="Height (h) — for PE" value={height} onChange={setHeight} unit="m" placeholder="e.g. 20" />
        <NumberInput label="Gravity (g)" value={gravity} onChange={setGravity} unit="m/s²" placeholder="9.80665" />
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
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="Kinetic Energy (KE)" value={result.KE} unit="J" highlight />
            <ResultBox label="Potential Energy (PE)" value={result.PE} unit="J" highlight />
            <ResultBox label="Total Mechanical Energy" value={result.total} unit="J" />
            <ResultBox label="Total Energy" value={formatNumber(parseFloat(result.total) / 1000, 6)} unit="kJ" />
          </div>

          {/* Energy bar chart */}
          {(parseFloat(result.KE) > 0 || parseFloat(result.PE) > 0) && (() => {
            const ke = parseFloat(result.KE);
            const pe = parseFloat(result.PE);
            const total = ke + pe;
            const kePct = total > 0 ? (ke / total) * 100 : 0;
            const pePct = total > 0 ? (pe / total) * 100 : 0;
            return (
              <div className="border border-classic-border bg-classic-bg p-4">
                <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-3">Energy Distribution</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-classic-muted">Kinetic Energy</span>
                      <span className="font-mono text-classic-text">{kePct.toFixed(1)}%</span>
                    </div>
                    <div className="h-5 bg-classic-input border border-classic-border">
                      <div className="h-full bg-classic-accent transition-all" style={{ width: `${kePct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-classic-muted">Potential Energy</span>
                      <span className="font-mono text-classic-text">{pePct.toFixed(1)}%</span>
                    </div>
                    <div className="h-5 bg-classic-input border border-classic-border">
                      <div className="h-full bg-classic-border-hover transition-all" style={{ width: `${pePct}%`, backgroundColor: '#666' }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
