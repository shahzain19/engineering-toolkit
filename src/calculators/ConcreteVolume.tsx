'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Building } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { formatNumber, addHistory } from '@/utils/storage';

type Shape = 'slab' | 'column_rect' | 'column_round' | 'footing';

// Mix ratio by volume: Cement:Sand:Aggregate = 1:2:4 (M15 nominal mix)
// Dry volume factor ≈ 1.54 (to account for voids)
const MIX = { cement_bags_per_m3: 6.3, sand_m3_per_m3: 0.42, agg_m3_per_m3: 0.84 };

export function ConcreteVolumeCalculator() {
  const [shape, setShape] = useState<Shape>('slab');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const [diameter, setDiameter] = useState('');
  const [height, setHeight] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [result, setResult] = useState<{
    volume: string; cementBags: string; sand: string; aggregate: string;
  } | null>(null);
  const [error, setError] = useState('');

  const shapes: { value: Shape; label: string }[] = [
    { value: 'slab', label: 'Slab / Pad' },
    { value: 'column_rect', label: 'Rectangular Column' },
    { value: 'column_round', label: 'Round Column' },
    { value: 'footing', label: 'Rectangular Footing' },
  ];

  const calculate = useCallback(() => {
    setError('');
    const qty = parseInt(quantity) || 1;
    let vol = 0;

    if (shape === 'slab') {
      const L = parseFloat(length), W = parseFloat(width), T = parseFloat(thickness) / 1000;
      if (isNaN(L) || isNaN(W) || isNaN(T) || L <= 0 || W <= 0 || T <= 0) return setError('Enter length, width (m), and thickness (mm).');
      vol = L * W * T;
    } else if (shape === 'column_rect') {
      const L = parseFloat(length) / 1000, W = parseFloat(width) / 1000, H = parseFloat(height);
      if (isNaN(L) || isNaN(W) || isNaN(H) || L <= 0 || W <= 0 || H <= 0) return setError('Enter width, depth (mm), and height (m).');
      vol = L * W * H;
    } else if (shape === 'column_round') {
      const D = parseFloat(diameter) / 1000, H = parseFloat(height);
      if (isNaN(D) || isNaN(H) || D <= 0 || H <= 0) return setError('Enter diameter (mm) and height (m).');
      vol = Math.PI * (D / 2) ** 2 * H;
    } else {
      const L = parseFloat(length), W = parseFloat(width), T = parseFloat(thickness) / 1000;
      if (isNaN(L) || isNaN(W) || isNaN(T) || L <= 0 || W <= 0 || T <= 0) return setError('Enter length, width (m), and depth (mm).');
      vol = L * W * T;
    }

    const totalVol = vol * qty;
    const cementBags = totalVol * MIX.cement_bags_per_m3;
    const sand = totalVol * MIX.sand_m3_per_m3;
    const agg = totalVol * MIX.agg_m3_per_m3;

    setResult({
      volume: formatNumber(totalVol, 4),
      cementBags: formatNumber(cementBags, 1),
      sand: formatNumber(sand, 3),
      aggregate: formatNumber(agg, 3),
    });

    addHistory({
      calculatorId: 'concrete-volume',
      calculatorTitle: 'Concrete Volume Calculator',
      inputs: { shape, quantity: qty },
      result: `${formatNumber(totalVol, 4)} m³`,
    });
  }, [shape, length, width, thickness, diameter, height, quantity]);

  const reset = () => { setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Building size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Concrete Volume Calculator</h2>
          <p className="text-sm text-classic-muted">Volume and material quantities for concrete elements</p>
        </div>
      </div>

      <div className="bg-classic-bg border border-classic-border p-3 text-xs text-classic-muted">
        Mix ratio: 1:2:4 (Cement:Sand:Aggregate) — M15 nominal mix. 1 bag = 50 kg cement.
      </div>

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Element Type</p>
        <div className="grid grid-cols-2 gap-2">
          {shapes.map((s) => (
            <button key={s.value} onClick={() => { setShape(s.value); setResult(null); setError(''); }}
              className={`py-2 px-3 text-sm font-medium border transition-colors ${shape === s.value ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(shape === 'slab' || shape === 'footing') && (
          <>
            <NumberInput label="Length" value={length} onChange={setLength} unit="m" placeholder="e.g. 5" />
            <NumberInput label="Width" value={width} onChange={setWidth} unit="m" placeholder="e.g. 4" />
            <NumberInput label="Thickness / Depth" value={thickness} onChange={setThickness} unit="mm" placeholder="e.g. 150" />
          </>
        )}
        {shape === 'column_rect' && (
          <>
            <NumberInput label="Width" value={length} onChange={setLength} unit="mm" placeholder="e.g. 300" />
            <NumberInput label="Depth" value={width} onChange={setWidth} unit="mm" placeholder="e.g. 300" />
            <NumberInput label="Height" value={height} onChange={setHeight} unit="m" placeholder="e.g. 3" />
          </>
        )}
        {shape === 'column_round' && (
          <>
            <NumberInput label="Diameter" value={diameter} onChange={setDiameter} unit="mm" placeholder="e.g. 400" />
            <NumberInput label="Height" value={height} onChange={setHeight} unit="m" placeholder="e.g. 3" />
          </>
        )}
        <NumberInput label="Quantity" value={quantity} onChange={setQuantity} placeholder="e.g. 4" />
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
          <ResultBox label="Concrete Volume" value={result.volume} unit="m³" highlight />
          <div className="grid grid-cols-3 gap-3">
            <ResultBox label="Cement Bags (50kg)" value={result.cementBags} unit="bags" />
            <ResultBox label="Sand" value={result.sand} unit="m³" />
            <ResultBox label="Aggregate" value={result.aggregate} unit="m³" />
          </div>
          <div className="bg-classic-bg border border-classic-border px-4 py-3 text-xs text-classic-muted">
            Add ~5% for wastage. Quantities are for 1:2:4 mix (M15). Consult a structural engineer for load-bearing elements.
          </div>
        </div>
      )}
    </div>
  );
}
