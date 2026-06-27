'use client';

import React, { useState, useMemo } from 'react';
import { RefreshCw, Palette } from 'lucide-react';
import { ResultBox } from '@/components/ResultBox';
import { RESISTOR_COLORS } from '@/data/calculators';
import { addHistory } from '@/utils/storage';

type BandMode = 4 | 5;

const COLOR_NAMES = Object.keys(RESISTOR_COLORS);
const DIGIT_COLORS = COLOR_NAMES.filter((c) => RESISTOR_COLORS[c].value !== null);
const MULTIPLIER_COLORS = COLOR_NAMES;
const TOLERANCE_COLORS = COLOR_NAMES.filter((c) => RESISTOR_COLORS[c].tolerance !== '');

function ColorSelect({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colors: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
        style={{
          borderLeftWidth: '4px',
          borderLeftColor: RESISTOR_COLORS[value]?.hex ?? '#444',
        }}
      >
        {colors.map((c) => (
          <option key={c} value={c} style={{ backgroundColor: '#1e293b' }}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ResistorColorCodeCalculator() {
  const [mode, setMode] = useState<BandMode>(4);
  const [band1, setBand1] = useState('brown');
  const [band2, setBand2] = useState('black');
  const [band3, setBand3] = useState('red'); // 5-band digit 3
  const [multiplier, setMultiplier] = useState('red');
  const [tolerance, setTolerance] = useState('gold');

  const result = useMemo(() => {
    const b1 = RESISTOR_COLORS[band1]?.value ?? 0;
    const b2 = RESISTOR_COLORS[band2]?.value ?? 0;
    const mult = RESISTOR_COLORS[multiplier]?.multiplier ?? 1;
    const tol = RESISTOR_COLORS[tolerance]?.tolerance ?? '±5%';

    let resistance: number;
    if (mode === 4) {
      resistance = (b1 * 10 + b2) * mult;
    } else {
      const b3 = RESISTOR_COLORS[band3]?.value ?? 0;
      resistance = (b1 * 100 + b2 * 10 + b3) * mult;
    }

    let formatted: string;
    if (resistance >= 1e6) formatted = `${(resistance / 1e6).toFixed(3)} MΩ`;
    else if (resistance >= 1e3) formatted = `${(resistance / 1e3).toFixed(3)} kΩ`;
    else formatted = `${resistance} Ω`;

    return { resistance, formatted, tolerance: tol };
  }, [mode, band1, band2, band3, multiplier, tolerance]);

  const handleCalculate = () => {
    addHistory({
      calculatorId: 'resistor-color-code',
      calculatorTitle: 'Resistor Color Code',
      inputs: { bands: mode, band1, band2, band3: mode === 5 ? band3 : '-', multiplier, tolerance },
      result: `${result.formatted} ${result.tolerance}`,
    });
  };

  const reset = () => { setBand1('brown'); setBand2('black'); setBand3('red'); setMultiplier('red'); setTolerance('gold'); };

  const bands = mode === 4
    ? [band1, band2, multiplier, tolerance]
    : [band1, band2, band3, multiplier, tolerance];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-yellow-500/15 text-yellow-400">
          <Palette size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Resistor Color Code</h2>
          <p className="text-sm text-slate-400">Decode 4-band or 5-band resistor color bands</p>
        </div>
      </div>

      {/* Band mode toggle */}
      <div className="flex gap-2">
        {([4, 5] as BandMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
              mode === m
                ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {m}-Band
          </button>
        ))}
      </div>

      {/* Resistor visualization */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex items-center gap-0 relative">
          {/* Lead left */}
          <div className="w-8 h-0.5 bg-slate-500" />
          {/* Body */}
          <div className="relative flex items-center h-10 rounded-full px-3 bg-gradient-to-b from-slate-600 to-slate-700 border border-slate-500 shadow-lg">
            <div className="flex gap-1 items-center h-full py-1">
              {bands.map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-full rounded-sm"
                  style={{ backgroundColor: RESISTOR_COLORS[color]?.hex ?? '#444' }}
                  title={color}
                />
              ))}
            </div>
          </div>
          {/* Lead right */}
          <div className="w-8 h-0.5 bg-slate-500" />
        </div>

        {/* Color labels below */}
        <div className={`grid gap-2 w-full max-w-sm`} style={{ gridTemplateColumns: `repeat(${bands.length}, 1fr)` }}>
          {bands.map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: RESISTOR_COLORS[color]?.hex ?? '#444' }} />
              <span className="text-[10px] text-slate-500 capitalize text-center leading-tight">{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Band selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ColorSelect label="Band 1 (1st digit)" value={band1} onChange={setBand1} colors={DIGIT_COLORS} />
        <ColorSelect label="Band 2 (2nd digit)" value={band2} onChange={setBand2} colors={DIGIT_COLORS} />
        {mode === 5 && (
          <ColorSelect label="Band 3 (3rd digit)" value={band3} onChange={setBand3} colors={DIGIT_COLORS} />
        )}
        <ColorSelect label={mode === 4 ? 'Band 3 (Multiplier)' : 'Band 4 (Multiplier)'} value={multiplier} onChange={setMultiplier} colors={MULTIPLIER_COLORS} />
        <ColorSelect label={mode === 4 ? 'Band 4 (Tolerance)' : 'Band 5 (Tolerance)'} value={tolerance} onChange={setTolerance} colors={TOLERANCE_COLORS} />
      </div>

      <div className="flex gap-3">
        <button onClick={handleCalculate} className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 font-bold text-sm hover:from-yellow-400 hover:to-amber-400 transition-all duration-200 shadow-lg shadow-yellow-500/20">
          Save to History
        </button>
        <button onClick={reset} className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all duration-200">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultBox label="Resistance Value" value={result.formatted} highlight />
        <ResultBox label="Tolerance" value={result.tolerance} />
      </div>

      <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 text-sm text-slate-400">
        <p className="font-semibold text-slate-300 mb-2">Value in Ohms</p>
        <p className="font-mono text-lg text-cyan-400">{result.resistance.toLocaleString()} Ω</p>
      </div>
    </div>
  );
}
