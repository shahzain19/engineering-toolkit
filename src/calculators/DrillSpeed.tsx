'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Drill } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

const MATERIALS: { value: string; label: string; sfm: number }[] = [
  { value: 'al', label: 'Aluminum', sfm: 300 },
  { value: 'brass', label: 'Brass / Bronze', sfm: 200 },
  { value: 'cast_iron', label: 'Cast Iron', sfm: 80 },
  { value: 'copper', label: 'Copper', sfm: 150 },
  { value: 'mild_steel', label: 'Mild Steel', sfm: 100 },
  { value: 'alloy_steel', label: 'Alloy Steel', sfm: 60 },
  { value: 'stainless', label: 'Stainless Steel (304)', sfm: 50 },
  { value: 'titanium', label: 'Titanium', sfm: 40 },
  { value: 'plastic', label: 'Plastic / Acrylic', sfm: 500 },
  { value: 'wood', label: 'Wood', sfm: 1000 },
  { value: 'custom', label: 'Custom SFM', sfm: 0 },
];

export function DrillSpeedCalculator() {
  const [diameter, setDiameter] = useState('');
  const [diamUnit, setDiamUnit] = useState('mm');
  const [material, setMaterial] = useState('mild_steel');
  const [customSFM, setCustomSFM] = useState('');
  const [result, setResult] = useState<{ rpm: string; feedRate: string; sfm: string } | null>(null);
  const [error, setError] = useState('');

  const diamUnitOptions = [
    { value: 'mm', label: 'mm' },
    { value: 'in', label: 'inches' },
  ];
  const matOptions = MATERIALS.map((m) => ({ value: m.value, label: m.label }));

  const calculate = useCallback(() => {
    setError('');
    const D_raw = parseFloat(diameter);
    if (isNaN(D_raw) || D_raw <= 0) return setError('Enter a valid drill diameter.');

    const D_in = diamUnit === 'mm' ? D_raw / 25.4 : D_raw;
    const mat = MATERIALS.find((m) => m.value === material);
    const sfm = material === 'custom' ? parseFloat(customSFM) : (mat?.sfm ?? 100);

    if (isNaN(sfm) || sfm <= 0) return setError('Enter a valid cutting speed (SFM).');

    // RPM = (SFM × 12) / (π × D_in)
    const rpm = (sfm * 12) / (Math.PI * D_in);
    // Typical feed rate: 0.001–0.003 in/rev for HSS drill
    const feedPerRev = 0.002; // in/rev (typical)
    const feedRate = rpm * feedPerRev; // in/min

    setResult({
      rpm: formatNumber(rpm, 0),
      feedRate: formatNumber(feedRate, 1),
      sfm: String(sfm),
    });

    addHistory({
      calculatorId: 'drill-speed',
      calculatorTitle: 'Drill Speed Calculator',
      inputs: { diameter: D_raw, unit: diamUnit, material: mat?.label ?? 'Custom', sfm },
      result: `RPM = ${formatNumber(rpm, 0)}`,
    });
  }, [diameter, diamUnit, material, customSFM]);

  const reset = () => { setDiameter(''); setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Drill size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Drill Speed Calculator</h2>
          <p className="text-sm text-classic-muted">Optimal RPM for drilling based on material and drill size</p>
        </div>
      </div>

      <FormulaDisplay
        formula="RPM = (SFM × 12) / (π × D)"
        description="Cutting speed to RPM conversion (imperial SFM basis)"
        variables={[
          { symbol: 'RPM', description: 'Spindle speed', unit: 'rev/min' },
          { symbol: 'SFM', description: 'Surface feet per minute', unit: 'ft/min' },
          { symbol: 'D', description: 'Drill diameter', unit: 'in' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput label="Drill Diameter" value={diameter} onChange={setDiameter} placeholder="e.g. 6" />
        <SelectInput label="Diameter Unit" value={diamUnit} onChange={setDiamUnit} options={diamUnitOptions} />
        <SelectInput label="Workpiece Material" value={material} onChange={setMaterial} options={matOptions} />
        {material === 'custom' && (
          <NumberInput label="Cutting Speed (SFM)" value={customSFM} onChange={setCustomSFM} unit="SFM" placeholder="e.g. 150" />
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

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ResultBox label="Recommended RPM" value={result.rpm} unit="RPM" highlight />
          <ResultBox label="Feed Rate (typical)" value={result.feedRate} unit="in/min" />
          <ResultBox label="Cutting Speed" value={result.sfm} unit="SFM" />
        </div>
      )}

      {/* Material SFM reference */}
      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">SFM Reference (HSS Drills)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-classic-border bg-classic-input">
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">Material</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">SFM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-classic-border">
              {MATERIALS.filter(m => m.value !== 'custom').map((m) => (
                <tr key={m.value} className={`hover:bg-classic-input transition-colors ${material === m.value ? 'bg-classic-input' : ''}`}>
                  <td className="px-3 py-2 text-classic-text">{m.label}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-accent">{m.sfm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
