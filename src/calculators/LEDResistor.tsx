'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

const LED_COLORS = [
  { value: '1.8', label: 'Red (Vf ≈ 1.8V)' },
  { value: '2.0', label: 'Orange (Vf ≈ 2.0V)' },
  { value: '2.1', label: 'Yellow (Vf ≈ 2.1V)' },
  { value: '2.2', label: 'Green (Vf ≈ 2.2V)' },
  { value: '3.3', label: 'Blue (Vf ≈ 3.3V)' },
  { value: '3.3', label: 'White (Vf ≈ 3.3V)' },
  { value: '3.4', label: 'UV (Vf ≈ 3.4V)' },
  { value: 'custom', label: 'Custom Vf' },
];

export function LEDResistorCalculator() {
  const [vsupply, setVsupply] = useState('');
  const [ledColor, setLedColor] = useState('2.2');
  const [customVf, setCustomVf] = useState('');
  const [iled, setIled] = useState('20');
  const [result, setResult] = useState<{ resistance: string; power: string; standardE12: string } | null>(null);
  const [error, setError] = useState('');

  const getVf = () => ledColor === 'custom' ? parseFloat(customVf) : parseFloat(ledColor);

  const calculate = useCallback(() => {
    const Vs = parseFloat(vsupply);
    const Vf = getVf();
    const I_mA = parseFloat(iled);
    setError('');

    if (isNaN(Vs)) return setError('Enter supply voltage.');
    if (isNaN(Vf) || Vf <= 0) return setError('Enter a valid LED forward voltage.');
    if (isNaN(I_mA) || I_mA <= 0) return setError('Enter a valid LED current (mA).');
    if (Vs <= Vf) return setError('Supply voltage must be greater than LED forward voltage.');

    const I_A = I_mA / 1000;
    const R = (Vs - Vf) / I_A;
    const P = (Vs - Vf) * I_A;

    // Find nearest E12 standard value
    const e12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
    let standard = R;
    let bestDiff = Infinity;
    for (let exp = 0; exp <= 6; exp++) {
      for (const base of e12) {
        const val = base * Math.pow(10, exp);
        const diff = Math.abs(val - R);
        if (diff < bestDiff) { bestDiff = diff; standard = val; }
      }
    }

    const resistance = formatNumber(R, 1);
    const power = formatNumber(P * 1000, 2);
    const standardStr = standard >= 1000 ? `${standard / 1000}kΩ` : `${standard}Ω`;

    setResult({ resistance, power, standardE12: standardStr });
    addHistory({
      calculatorId: 'led-resistor',
      calculatorTitle: 'LED Resistor Calculator',
      inputs: { Vs, Vf, I_mA },
      result: `R = ${resistance} Ω (nearest E12: ${standardStr})`,
    });
  }, [vsupply, ledColor, customVf, iled]);

  const reset = () => { setVsupply(''); setIled('20'); setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text">
          <Lightbulb size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">LED Resistor Calculator</h2>
          <p className="text-sm text-classic-muted">Find the correct current-limiting resistor for an LED</p>
        </div>
      </div>

      <FormulaDisplay
        formula="R = (Vs - Vf) / I"
        description="Current-limiting resistor for LED circuit"
        variables={[
          { symbol: 'R', description: 'Series resistor', unit: 'Ω' },
          { symbol: 'Vs', description: 'Supply voltage', unit: 'V' },
          { symbol: 'Vf', description: 'LED forward voltage', unit: 'V' },
          { symbol: 'I', description: 'LED forward current', unit: 'A' },
        ]}
      />

      {/* Circuit diagram */}
      <div className="border border-classic-border bg-classic-bg p-4">
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-3">Circuit Diagram</p>
        <div className="font-mono text-xs text-classic-muted flex flex-col items-center gap-1">
          <span className="text-classic-text font-bold">Vs = {vsupply || '?'}V</span>
          <span>│</span>
          <span className="border border-classic-border px-3 py-1 text-classic-text bg-classic-input">R = {result?.resistance || '?'} Ω</span>
          <span>│</span>
          <span className="border border-classic-border px-3 py-1 bg-yellow-50 text-yellow-700">LED (Vf = {ledColor === 'custom' ? customVf || '?' : ledColor}V)</span>
          <span>│</span>
          <span>GND</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput label="Supply Voltage (Vs)" value={vsupply} onChange={setVsupply} unit="V" placeholder="e.g. 5" />
        <SelectInput label="LED Color / Forward Voltage" value={ledColor} onChange={setLedColor} options={LED_COLORS} />
        {ledColor === 'custom' && (
          <NumberInput label="Custom Vf" value={customVf} onChange={setCustomVf} unit="V" placeholder="e.g. 2.5" />
        )}
        <NumberInput label="LED Forward Current (I)" value={iled} onChange={setIled} unit="mA" placeholder="e.g. 20" />
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
          <ResultBox label="Resistor Value" value={result.resistance} unit="Ω" highlight />
          <ResultBox label="Nearest E12" value={result.standardE12} />
          <ResultBox label="Power Dissipated" value={result.power} unit="mW" />
        </div>
      )}
    </div>
  );
}
