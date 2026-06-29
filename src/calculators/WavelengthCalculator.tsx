'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Radio } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

type SolveFor = 'wavelength' | 'frequency' | 'speed';

const MEDIUM_SPEED: { value: string; label: string; speed: number }[] = [
  { value: 'vacuum', label: 'Free space / Vacuum (c)', speed: 299792458 },
  { value: 'air', label: 'Air (~c)', speed: 299705000 },
  { value: 'coax_vf66', label: 'Coax cable (VF=0.66)', speed: 299792458 * 0.66 },
  { value: 'coax_vf80', label: 'Coax cable (VF=0.80)', speed: 299792458 * 0.80 },
  { value: 'pcb_fr4', label: 'PCB trace FR4 (VF≈0.55)', speed: 299792458 * 0.55 },
  { value: 'custom', label: 'Custom velocity factor', speed: 0 },
];

const FREQ_BANDS: { name: string; fMin: number; fMax: number }[] = [
  { name: 'ELF', fMin: 3, fMax: 30 },
  { name: 'VLF', fMin: 3e3, fMax: 30e3 },
  { name: 'LF (AM)', fMin: 30e3, fMax: 300e3 },
  { name: 'MF (AM)', fMin: 300e3, fMax: 3e6 },
  { name: 'HF (Shortwave)', fMin: 3e6, fMax: 30e6 },
  { name: 'VHF (FM/TV)', fMin: 30e6, fMax: 300e6 },
  { name: 'UHF (UHF TV/Cell)', fMin: 300e6, fMax: 3e9 },
  { name: 'SHF (Microwave)', fMin: 3e9, fMax: 30e9 },
  { name: 'EHF (mm-wave)', fMin: 30e9, fMax: 300e9 },
];

function getBand(f: number): string {
  return FREQ_BANDS.find(b => f >= b.fMin && f < b.fMax)?.name ?? 'Outside standard bands';
}

function fmtFreq(f: number): string {
  if (f >= 1e9) return `${(f / 1e9).toFixed(4)} GHz`;
  if (f >= 1e6) return `${(f / 1e6).toFixed(4)} MHz`;
  if (f >= 1e3) return `${(f / 1e3).toFixed(4)} kHz`;
  return `${f.toFixed(4)} Hz`;
}

export function WavelengthCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>('wavelength');
  const [frequency, setFrequency] = useState('');
  const [freqUnit, setFreqUnit] = useState('MHz');
  const [wavelength, setWavelength] = useState('');
  const [waveUnit, setWaveUnit] = useState('m');
  const [medium, setMedium] = useState('vacuum');
  const [customVF, setCustomVF] = useState('');
  const [result, setResult] = useState<{ main: string; secondary: string; band: string } | null>(null);
  const [error, setError] = useState('');

  const freqUnitMul: Record<string, number> = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 };
  const waveUnitMul: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1 };
  const freqOpts = ['Hz', 'kHz', 'MHz', 'GHz'].map(u => ({ value: u, label: u }));
  const waveOpts = ['mm', 'cm', 'm'].map(u => ({ value: u, label: u }));
  const mediumOpts = MEDIUM_SPEED.map(m => ({ value: m.value, label: m.label }));

  const getSpeed = () => {
    if (medium === 'custom') return parseFloat(customVF) * 299792458;
    return MEDIUM_SPEED.find(m => m.value === medium)?.speed ?? 299792458;
  };

  const calculate = useCallback(() => {
    setError('');
    const c = getSpeed();
    if (isNaN(c) || c <= 0) return setError('Enter a valid velocity factor (0–1).');

    if (solveFor === 'wavelength') {
      const f = parseFloat(frequency) * (freqUnitMul[freqUnit] ?? 1);
      if (isNaN(f) || f <= 0) return setError('Enter a valid frequency.');
      const lambda = c / f;
      const lambdaUnit = lambda < 0.01 ? lambda * 1000 : lambda;
      const unit = lambda < 0.01 ? 'mm' : 'm';
      const mainStr = formatNumber(lambdaUnit, 6);
      setResult({ main: mainStr, secondary: `λ/2 = ${formatNumber(lambdaUnit / 2, 6)} ${unit}  ·  λ/4 = ${formatNumber(lambdaUnit / 4, 6)} ${unit}`, band: getBand(f) });
      addHistory({ calculatorId: 'wavelength-calculator', calculatorTitle: 'Wavelength Calculator', inputs: { frequency: parseFloat(frequency), unit: freqUnit }, result: `λ = ${mainStr} ${unit}` });
    } else {
      const lam = parseFloat(wavelength) * (waveUnitMul[waveUnit] ?? 1);
      if (isNaN(lam) || lam <= 0) return setError('Enter a valid wavelength.');
      const f = c / lam;
      const mainStr = fmtFreq(f);
      setResult({ main: mainStr, secondary: `λ/2 antenna = ${formatNumber(lam * 500, 2)} mm  ·  λ/4 antenna = ${formatNumber(lam * 250, 2)} mm`, band: getBand(f) });
      addHistory({ calculatorId: 'wavelength-calculator', calculatorTitle: 'Wavelength Calculator', inputs: { wavelength: parseFloat(wavelength), unit: waveUnit }, result: `f = ${mainStr}` });
    }
  }, [solveFor, frequency, freqUnit, wavelength, waveUnit, medium, customVF]);

  const reset = () => { setFrequency(''); setWavelength(''); setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Radio size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Wavelength Calculator</h2>
          <p className="text-sm text-classic-muted">Frequency ↔ wavelength for electromagnetic waves</p>
        </div>
      </div>

      <FormulaDisplay
        formula="λ = c / f    f = c / λ"
        variables={[
          { symbol: 'λ', description: 'Wavelength', unit: 'm' },
          { symbol: 'f', description: 'Frequency', unit: 'Hz' },
          { symbol: 'c', description: 'Wave speed (medium)', unit: 'm/s' },
        ]}
      />

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Solve For</p>
        <div className="grid grid-cols-2 gap-2">
          {(['wavelength', 'frequency'] as SolveFor[]).map((m) => (
            <button key={m} onClick={() => { setSolveFor(m); setResult(null); setError(''); }}
              className={`py-2 px-3 text-sm font-medium border transition-colors ${solveFor === m ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
              {m === 'wavelength' ? 'Wavelength' : 'Frequency'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {solveFor === 'wavelength' ? (
          <>
            <NumberInput label="Frequency" value={frequency} onChange={setFrequency} placeholder="e.g. 2400" />
            <SelectInput label="Frequency Unit" value={freqUnit} onChange={setFreqUnit} options={freqOpts} />
          </>
        ) : (
          <>
            <NumberInput label="Wavelength" value={wavelength} onChange={setWavelength} placeholder="e.g. 0.125" />
            <SelectInput label="Wavelength Unit" value={waveUnit} onChange={setWaveUnit} options={waveOpts} />
          </>
        )}
        <SelectInput label="Medium" value={medium} onChange={setMedium} options={mediumOpts} />
        {medium === 'custom' && (
          <NumberInput label="Velocity Factor (0–1)" value={customVF} onChange={setCustomVF} placeholder="e.g. 0.66" />
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
        <div className="space-y-3">
          <ResultBox label={solveFor === 'wavelength' ? 'Wavelength' : 'Frequency'} value={result.main} highlight />
          <div className="bg-classic-bg border border-classic-border px-4 py-2 text-xs font-mono text-classic-muted">{result.secondary}</div>
          <div className="bg-classic-bg border border-classic-border px-4 py-2 text-xs text-classic-text font-semibold">
            RF Band: <span className="text-classic-accent">{result.band}</span>
          </div>
        </div>
      )}

      {/* Band reference */}
      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">RF Frequency Bands</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-classic-border bg-classic-input">
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">Band</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">Frequency Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-classic-border">
              {FREQ_BANDS.map(b => (
                <tr key={b.name} className="hover:bg-classic-input transition-colors">
                  <td className="px-3 py-2 text-classic-accent font-medium">{b.name}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-muted">{fmtFreq(b.fMin)} – {fmtFreq(b.fMax)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
