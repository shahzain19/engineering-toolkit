'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Wind } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

type SolveFor = 'mach' | 'airspeed' | 'sos';

// Speed of sound in dry air: a = sqrt(γ·R·T)
// γ = 1.4, R = 287.05 J/(kg·K)
// ISA: T(alt_m) = 288.15 - 0.0065*alt  (troposphere, up to 11000m)
function sosISA(alt_m: number): number {
  const T = alt_m <= 11000 ? 288.15 - 0.0065 * alt_m : 216.65;
  return Math.sqrt(1.4 * 287.05 * T);
}

export function MachNumberCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>('mach');
  const [airspeed, setAirspeed] = useState('');
  const [mach, setMach] = useState('');
  const [altitude, setAltitude] = useState('0');
  const [speedUnit, setSpeedUnit] = useState('ms');
  const [result, setResult] = useState<{
    mach?: string; airspeed?: string; sos: string; regime: string;
    airspeedKmh?: string; airspeedKts?: string;
  } | null>(null);
  const [error, setError] = useState('');

  const speedUnitOptions = [
    { value: 'ms', label: 'm/s' },
    { value: 'kmh', label: 'km/h' },
    { value: 'kts', label: 'knots' },
    { value: 'mph', label: 'mph' },
  ];
  const toMs: Record<string, number> = { ms: 1, kmh: 1 / 3.6, kts: 0.514444, mph: 0.44704 };
  const fromMs: Record<string, number> = { ms: 1, kmh: 3.6, kts: 1.94384, mph: 2.23694 };

  const getRegime = (m: number) => {
    if (m < 0.8) return 'Subsonic';
    if (m < 1.0) return 'Transonic (high)';
    if (m < 1.2) return 'Transonic (low supersonic)';
    if (m < 5.0) return 'Supersonic';
    return 'Hypersonic';
  };

  const calculate = useCallback(() => {
    setError('');
    const alt = parseFloat(altitude);
    if (isNaN(alt) || alt < 0) return setError('Enter a valid altitude (0 for sea level).');
    const sos = sosISA(alt);

    if (solveFor === 'mach') {
      const v_unit = parseFloat(airspeed);
      if (isNaN(v_unit) || v_unit < 0) return setError('Enter a valid airspeed.');
      const v_ms = v_unit * toMs[speedUnit];
      const M = v_ms / sos;
      setResult({
        mach: formatNumber(M, 4), sos: formatNumber(sos, 2), regime: getRegime(M),
        airspeedKmh: formatNumber(v_ms * 3.6, 2), airspeedKts: formatNumber(v_ms * 1.94384, 2),
      });
      addHistory({ calculatorId: 'mach-number', calculatorTitle: 'Mach Number', inputs: { airspeed: v_unit, unit: speedUnit, altitude: alt }, result: `M = ${formatNumber(M, 4)}` });
    } else {
      const M = parseFloat(mach);
      if (isNaN(M) || M < 0) return setError('Enter a valid Mach number.');
      const v_ms = M * sos;
      const v_unit = v_ms * fromMs[speedUnit];
      setResult({
        airspeed: formatNumber(v_unit, 2), sos: formatNumber(sos, 2), regime: getRegime(M),
        airspeedKmh: formatNumber(v_ms * 3.6, 2), airspeedKts: formatNumber(v_ms * 1.94384, 2),
      });
      addHistory({ calculatorId: 'mach-number', calculatorTitle: 'Mach Number', inputs: { mach: M, altitude: alt }, result: `v = ${formatNumber(v_unit, 2)} ${speedUnit}` });
    }
  }, [solveFor, airspeed, mach, altitude, speedUnit]);

  const reset = () => { setAirspeed(''); setMach(''); setAltitude('0'); setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Wind size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Mach Number Calculator</h2>
          <p className="text-sm text-classic-muted">Airspeed ↔ Mach number with ISA atmosphere model</p>
        </div>
      </div>

      <FormulaDisplay
        formula="M = v / a    a = √(γ·R·T)"
        description="Mach number and ISA speed of sound (troposphere)"
        variables={[
          { symbol: 'M', description: 'Mach number (dimensionless)' },
          { symbol: 'v', description: 'Airspeed', unit: 'm/s' },
          { symbol: 'a', description: 'Speed of sound', unit: 'm/s' },
          { symbol: 'T', description: 'Temperature (ISA)', unit: 'K' },
        ]}
      />

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Solve For</p>
        <div className="grid grid-cols-2 gap-2">
          {(['mach', 'airspeed'] as SolveFor[]).map((m) => (
            <button key={m} onClick={() => { setSolveFor(m); setResult(null); setError(''); }}
              className={`py-2 px-3 text-sm font-medium border transition-colors ${solveFor === m ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
              {m === 'mach' ? 'Mach Number' : 'Airspeed'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {solveFor === 'mach' ? (
          <>
            <NumberInput label="Airspeed" value={airspeed} onChange={setAirspeed} placeholder="e.g. 340" />
            <SelectInput label="Speed Unit" value={speedUnit} onChange={setSpeedUnit} options={speedUnitOptions} />
          </>
        ) : (
          <>
            <NumberInput label="Mach Number" value={mach} onChange={setMach} placeholder="e.g. 1.5" />
            <SelectInput label="Output Speed Unit" value={speedUnit} onChange={setSpeedUnit} options={speedUnitOptions} />
          </>
        )}
        <NumberInput label="Altitude" value={altitude} onChange={setAltitude} unit="m" placeholder="0 = sea level" />
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
          {result.mach && <ResultBox label="Mach Number" value={result.mach} highlight />}
          {result.airspeed && <ResultBox label={`Airspeed (${speedUnit})`} value={result.airspeed} unit={speedUnit} highlight />}
          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="Speed of Sound (ISA)" value={result.sos} unit="m/s" />
            <ResultBox label="Airspeed" value={result.airspeedKmh ?? null} unit="km/h" />
            <ResultBox label="Airspeed" value={result.airspeedKts ?? null} unit="knots" />
          </div>
          <div className={`px-4 py-3 border text-sm font-semibold ${
            result.regime.includes('Hyper') ? 'bg-red-50 border-red-200 text-red-700' :
            result.regime.includes('Super') ? 'bg-orange-50 border-orange-200 text-orange-700' :
            result.regime.includes('Transonic') ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
            'bg-green-50 border-green-200 text-green-700'
          }`}>
            Flight Regime: {result.regime}
          </div>
        </div>
      )}
    </div>
  );
}
