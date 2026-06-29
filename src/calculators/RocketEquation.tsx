'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Rocket } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

const PROPELLANTS: { value: string; label: string; isp: number }[] = [
  { value: 'lox_kerosene', label: 'LOX / Kerosene (RP-1)', isp: 358 },
  { value: 'lox_lh2', label: 'LOX / Liquid Hydrogen', isp: 450 },
  { value: 'lox_methane', label: 'LOX / Methane', isp: 380 },
  { value: 'n2o4_udmh', label: 'N₂O₄ / UDMH (hypergolic)', isp: 312 },
  { value: 'solid_srb', label: 'Solid (APCP — hobby)', isp: 175 },
  { value: 'solid_shuttle', label: 'Solid (SRB — shuttle)', isp: 269 },
  { value: 'ion', label: 'Ion Thruster (Xe)', isp: 3000 },
  { value: 'custom', label: 'Custom Isp', isp: 0 },
];

export function RocketEquationCalculator() {
  const [propellant, setPropellant] = useState('lox_kerosene');
  const [customIsp, setCustomIsp] = useState('');
  const [wetMass, setWetMass] = useState('');
  const [dryMass, setDryMass] = useState('');
  const [result, setResult] = useState<{
    deltaV: string; massRatio: string; propellantMass: string; ve: string;
  } | null>(null);
  const [error, setError] = useState('');

  const getIsp = () => propellant === 'custom' ? parseFloat(customIsp) : (PROPELLANTS.find(p => p.value === propellant)?.isp ?? 0);
  const G0 = 9.80665;

  const calculate = useCallback(() => {
    setError('');
    const m_wet = parseFloat(wetMass);
    const m_dry = parseFloat(dryMass);
    const Isp = getIsp();

    if (isNaN(m_wet) || m_wet <= 0) return setError('Enter a valid wet (full) mass.');
    if (isNaN(m_dry) || m_dry <= 0) return setError('Enter a valid dry (empty) mass.');
    if (m_dry >= m_wet) return setError('Dry mass must be less than wet mass.');
    if (isNaN(Isp) || Isp <= 0) return setError('Enter a valid specific impulse (Isp).');

    const ve = Isp * G0; // effective exhaust velocity m/s
    const massRatio = m_wet / m_dry;
    const deltaV = ve * Math.log(massRatio);
    const propellantMass = m_wet - m_dry;

    setResult({
      deltaV: formatNumber(deltaV, 2),
      massRatio: formatNumber(massRatio, 4),
      propellantMass: formatNumber(propellantMass, 2),
      ve: formatNumber(ve, 1),
    });

    addHistory({
      calculatorId: 'rocket-equation',
      calculatorTitle: 'Rocket Equation',
      inputs: { Isp, wetMass: m_wet, dryMass: m_dry },
      result: `Δv = ${formatNumber(deltaV, 2)} m/s`,
    });
  }, [propellant, customIsp, wetMass, dryMass]);

  const reset = () => { setWetMass(''); setDryMass(''); setResult(null); setError(''); };

  const propOptions = PROPELLANTS.map(p => ({ value: p.value, label: p.label }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Rocket size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Rocket Equation Calculator</h2>
          <p className="text-sm text-classic-muted">Tsiolkovsky rocket equation — delta-v budget</p>
        </div>
      </div>

      <FormulaDisplay
        formula="Δv = Isp × g₀ × ln(m_wet / m_dry)"
        description="Tsiolkovsky rocket equation"
        variables={[
          { symbol: 'Δv', description: 'Delta-v (velocity change)', unit: 'm/s' },
          { symbol: 'Isp', description: 'Specific impulse', unit: 's' },
          { symbol: 'g₀', description: 'Standard gravity (9.8067)', unit: 'm/s²' },
          { symbol: 'm_wet', description: 'Initial (fueled) mass', unit: 'kg' },
          { symbol: 'm_dry', description: 'Final (empty) mass', unit: 'kg' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput label="Propellant / Engine Type" value={propellant} onChange={setPropellant} options={propOptions} />
        {propellant === 'custom' && (
          <NumberInput label="Specific Impulse (Isp)" value={customIsp} onChange={setCustomIsp} unit="s" placeholder="e.g. 450" />
        )}
        {propellant !== 'custom' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Selected Isp</label>
            <div className="px-2 py-1.5 bg-classic-bg border border-classic-border text-classic-accent font-mono text-sm">
              {getIsp()} s
            </div>
          </div>
        )}
        <NumberInput label="Wet Mass (m_wet)" value={wetMass} onChange={setWetMass} unit="kg" placeholder="e.g. 10000" />
        <NumberInput label="Dry Mass (m_dry)" value={dryMass} onChange={setDryMass} unit="kg" placeholder="e.g. 3000" />
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
          <ResultBox label="Delta-v (Δv)" value={result.deltaV} unit="m/s" highlight />
          <div className="grid grid-cols-3 gap-3">
            <ResultBox label="Mass Ratio" value={result.massRatio} />
            <ResultBox label="Propellant Mass" value={result.propellantMass} unit="kg" />
            <ResultBox label="Exhaust Velocity" value={result.ve} unit="m/s" />
          </div>

          {/* Context reference */}
          <div className="border border-classic-border bg-classic-bg p-4">
            <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-3">Δv Reference Milestones</p>
            <div className="space-y-1 text-xs">
              {[
                { name: 'Low Earth Orbit (LEO)', dv: 9400 },
                { name: 'Geostationary (GEO)', dv: 11300 },
                { name: 'Trans-Lunar Injection', dv: 12600 },
                { name: 'Mars Transfer', dv: 11500 },
              ].map((ref) => {
                const dv = parseFloat(result.deltaV);
                const pct = Math.min(100, (dv / ref.dv) * 100);
                return (
                  <div key={ref.name}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-classic-muted">{ref.name}</span>
                      <span className="font-mono text-classic-text">{ref.dv.toLocaleString()} m/s</span>
                    </div>
                    <div className="h-2 bg-classic-input border border-classic-border mb-2">
                      <div className="h-full bg-classic-accent transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
