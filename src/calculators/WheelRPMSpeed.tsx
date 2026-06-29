'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Gauge } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

type Mode = 'rpm_to_speed' | 'speed_to_rpm';

export function WheelRPMSpeedConverter() {
  const [mode, setMode] = useState<Mode>('rpm_to_speed');
  const [rpm, setRpm] = useState('');
  const [speed, setSpeed] = useState('');
  const [diameter, setDiameter] = useState('');
  const [diamUnit, setDiamUnit] = useState('mm');
  const [result, setResult] = useState<{ primary: string; secondary: string } | null>(null);
  const [error, setError] = useState('');

  const diamUnitOptions = [
    { value: 'mm', label: 'Millimeters (mm)' },
    { value: 'cm', label: 'Centimeters (cm)' },
    { value: 'm', label: 'Meters (m)' },
    { value: 'in', label: 'Inches (in)' },
  ];

  const diamToM: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1, in: 0.0254 };

  const calculate = useCallback(() => {
    setError('');
    const D_m = parseFloat(diameter) * diamToM[diamUnit];
    if (isNaN(D_m) || D_m <= 0) return setError('Enter a valid wheel diameter.');

    const circumference = Math.PI * D_m; // m per revolution

    if (mode === 'rpm_to_speed') {
      const R = parseFloat(rpm);
      if (isNaN(R) || R < 0) return setError('Enter a valid RPM value.');
      const mps = (R / 60) * circumference;
      const kmh = mps * 3.6;
      const mph = mps * 2.23694;
      setResult({ primary: formatNumber(mps, 4), secondary: `${formatNumber(kmh, 3)} km/h · ${formatNumber(mph, 3)} mph` });
      addHistory({ calculatorId: 'wheel-rpm-speed', calculatorTitle: 'Wheel RPM ↔ Speed', inputs: { rpm: R, diameter: parseFloat(diameter), unit: diamUnit }, result: `${formatNumber(mps, 4)} m/s` });
    } else {
      const S = parseFloat(speed);
      if (isNaN(S) || S < 0) return setError('Enter a valid speed in m/s.');
      const R = (S / circumference) * 60;
      setResult({ primary: formatNumber(R, 3), secondary: `at ${S} m/s` });
      addHistory({ calculatorId: 'wheel-rpm-speed', calculatorTitle: 'Wheel RPM ↔ Speed', inputs: { speed: S, diameter: parseFloat(diameter), unit: diamUnit }, result: `${formatNumber(R, 3)} RPM` });
    }
  }, [mode, rpm, speed, diameter, diamUnit]);

  const reset = () => { setRpm(''); setSpeed(''); setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text">
          <Gauge size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Wheel RPM ↔ Speed Converter</h2>
          <p className="text-sm text-classic-muted">Convert between wheel rotational speed and linear velocity</p>
        </div>
      </div>

      <FormulaDisplay
        formula="v = (RPM / 60) × π × D"
        description="Linear speed from rotational speed and wheel diameter"
        variables={[
          { symbol: 'v', description: 'Linear speed', unit: 'm/s' },
          { symbol: 'RPM', description: 'Rotations per minute' },
          { symbol: 'D', description: 'Wheel diameter', unit: 'm' },
        ]}
      />

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Direction</p>
        <div className="grid grid-cols-2 gap-2">
          {(['rpm_to_speed', 'speed_to_rpm'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setResult(null); setError(''); }}
              className={`py-2 px-3 text-sm font-medium border transition-colors ${
                mode === m ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'
              }`}
            >
              {m === 'rpm_to_speed' ? 'RPM → Speed' : 'Speed → RPM'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mode === 'rpm_to_speed' ? (
          <NumberInput label="Wheel Speed" value={rpm} onChange={setRpm} unit="RPM" placeholder="e.g. 300" />
        ) : (
          <NumberInput label="Linear Speed" value={speed} onChange={setSpeed} unit="m/s" placeholder="e.g. 1.5" />
        )}
        <NumberInput label="Wheel Diameter" value={diameter} onChange={setDiameter} placeholder="e.g. 100" />
        <SelectInput label="Diameter Unit" value={diamUnit} onChange={setDiamUnit} options={diamUnitOptions} />
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
          <ResultBox
            label={mode === 'rpm_to_speed' ? 'Linear Speed' : 'Wheel Speed'}
            value={result.primary}
            unit={mode === 'rpm_to_speed' ? 'm/s' : 'RPM'}
            highlight
          />
          <div className="bg-classic-bg border border-classic-border px-4 py-3 text-sm text-classic-muted font-mono">
            {result.secondary}
          </div>
        </div>
      )}
    </div>
  );
}
