'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Ruler } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { BEAM_MATERIALS } from '@/data/calculators';
import { formatNumber, addHistory } from '@/utils/storage';

const LOAD_TYPES = [
  { value: 'center', label: 'Central Point Load' },
  { value: 'udl', label: 'Uniformly Distributed Load (UDL)' },
  { value: 'end', label: 'Cantilever - End Point Load' },
];

// Cross sections (rectangular beam assumed)
const SECTION_SIZES = [
  { value: '100x100', label: '100 × 100 mm' },
  { value: '150x100', label: '150 × 100 mm' },
  { value: '200x100', label: '200 × 100 mm' },
  { value: '200x200', label: '200 × 200 mm' },
  { value: '300x150', label: '300 × 150 mm' },
  { value: 'custom', label: 'Custom' },
];

export function BeamCalculator() {
  const [length, setLength] = useState('');
  const [force, setForce] = useState('');
  const [materialKey, setMaterialKey] = useState('steel');
  const [loadType, setLoadType] = useState('center');
  const [sectionSize, setSectionSize] = useState('200x100');
  const [customH, setCustomH] = useState('');
  const [customW, setCustomW] = useState('');
  const [results, setResults] = useState<{
    maxMoment: string;
    maxShear: string;
    maxDeflection: string;
    maxStress: string;
    safetyFactor: string;
    status: 'safe' | 'unsafe' | 'borderline';
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    const L = parseFloat(length) / 1000; // mm to m
    const F = parseFloat(force); // N
    const mat = BEAM_MATERIALS[materialKey];
    setError('');

    if (isNaN(L) || isNaN(F) || L <= 0 || F <= 0) return setError('Enter valid length (mm) and force (N).');

    // Section dimensions
    let h_mm: number, w_mm: number;
    if (sectionSize === 'custom') {
      h_mm = parseFloat(customH);
      w_mm = parseFloat(customW);
      if (isNaN(h_mm) || isNaN(w_mm) || h_mm <= 0 || w_mm <= 0) return setError('Enter valid custom section dimensions.');
    } else {
      const [hs, ws] = sectionSize.split('x').map(Number);
      h_mm = hs; w_mm = ws;
    }

    const h = h_mm / 1000; // m
    const w = w_mm / 1000; // m
    const I = (w * Math.pow(h, 3)) / 12; // Second moment of area (m^4)
    const y = h / 2; // Distance to neutral axis (m)

    let M_max = 0; // Max bending moment (N·m)
    let V_max = 0; // Max shear force (N)
    let delta_max = 0; // Max deflection (m)

    if (loadType === 'center') {
      M_max = (F * L) / 4;
      V_max = F / 2;
      delta_max = (F * Math.pow(L, 3)) / (48 * mat.elasticModulus * I);
    } else if (loadType === 'udl') {
      const w_udl = F / L; // N/m
      M_max = (w_udl * Math.pow(L, 2)) / 8;
      V_max = (w_udl * L) / 2;
      delta_max = (5 * w_udl * Math.pow(L, 4)) / (384 * mat.elasticModulus * I);
    } else {
      // Cantilever
      M_max = F * L;
      V_max = F;
      delta_max = (F * Math.pow(L, 3)) / (3 * mat.elasticModulus * I);
    }

    const sigma_max = (M_max * y) / I; // Max bending stress (Pa)
    const safety = mat.yieldStrength / sigma_max;

    const status: 'safe' | 'unsafe' | 'borderline' =
      safety >= 2 ? 'safe' : safety >= 1 ? 'borderline' : 'unsafe';

    setResults({
      maxMoment: formatNumber(M_max, 2),
      maxShear: formatNumber(V_max, 2),
      maxDeflection: formatNumber(delta_max * 1000, 4), // in mm
      maxStress: formatNumber(sigma_max / 1e6, 2), // in MPa
      safetyFactor: formatNumber(safety, 2),
      status,
    });

    addHistory({
      calculatorId: 'beam-calculator',
      calculatorTitle: 'Beam Calculator',
      inputs: { L: L * 1000, F, material: mat.name, loadType },
      result: `M = ${formatNumber(M_max, 2)} N·m, SF = ${formatNumber(safety, 2)}`,
    });
  }, [length, force, materialKey, loadType, sectionSize, customH, customW]);

  const reset = () => { setLength(''); setForce(''); setResults(null); setError(''); };
  const mat = BEAM_MATERIALS[materialKey];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400"><Ruler size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Beam Bending Calculator</h2>
          <p className="text-sm text-slate-400">Simple beam bending stress & deflection analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[
          { key: 'center', label: 'Center Load', icon: '⬇' },
          { key: 'udl', label: 'UDL', icon: '▓▓▓' },
          { key: 'end', label: 'Cantilever', icon: '┤⬇' },
        ].map((lt) => (
          <button
            key={lt.key}
            onClick={() => setLoadType(lt.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              loadType === lt.key ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <span className="font-mono">{lt.icon}</span> {lt.label}
          </button>
        ))}
      </div>

      <FormulaDisplay
        formula={
          loadType === 'center' ? 'M = F·L/4, δ = FL³/48EI' :
          loadType === 'udl' ? 'M = wL²/8, δ = 5wL⁴/384EI' :
          'M = F·L, δ = FL³/3EI'
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput label="Beam Length" value={length} onChange={setLength} unit="mm" placeholder="e.g. 2000" />
        <NumberInput
          label={loadType === 'udl' ? 'Total Load (UDL × L)' : 'Point Force'}
          value={force} onChange={setForce} unit="N" placeholder="e.g. 5000"
        />
        <SelectInput label="Material" value={materialKey} onChange={setMaterialKey}
          options={Object.entries(BEAM_MATERIALS).map(([k, v]) => ({ value: k, label: v.name }))} />
        <SelectInput label="Section Size" value={sectionSize} onChange={setSectionSize} options={SECTION_SIZES} />
        {sectionSize === 'custom' && (
          <>
            <NumberInput label="Section Height" value={customH} onChange={setCustomH} unit="mm" />
            <NumberInput label="Section Width" value={customW} onChange={setCustomW} unit="mm" />
          </>
        )}
      </div>

      {/* Material info */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700">
          <p className="text-slate-500 mb-1">Elastic Modulus</p>
          <p className="font-mono text-blue-400 font-bold">{(mat.elasticModulus / 1e9).toFixed(1)} GPa</p>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700">
          <p className="text-slate-500 mb-1">Yield Strength</p>
          <p className="font-mono text-blue-400 font-bold">{(mat.yieldStrength / 1e6).toFixed(0)} MPa</p>
        </div>
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
        <div className="space-y-3">
          {/* Safety status banner */}
          <div className={`rounded-xl px-4 py-3 border text-sm font-semibold flex items-center gap-2 ${
            results.status === 'safe' ? 'bg-green-500/15 border-green-500/40 text-green-400' :
            results.status === 'borderline' ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400' :
            'bg-red-500/15 border-red-500/40 text-red-400'
          }`}>
            {results.status === 'safe' ? '✓ SAFE' : results.status === 'borderline' ? '⚠ BORDERLINE' : '✗ UNSAFE'} — Safety Factor: {results.safetyFactor}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="Max Bending Moment" value={results.maxMoment} unit="N·m" highlight />
            <ResultBox label="Max Shear Force" value={results.maxShear} unit="N" />
            <ResultBox label="Max Deflection" value={results.maxDeflection} unit="mm" />
            <ResultBox label="Max Bending Stress" value={results.maxStress} unit="MPa" />
          </div>
        </div>
      )}
    </div>
  );
}
