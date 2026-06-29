'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Weight } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

const MATERIALS_DENSITY: { value: string; label: string; density: number }[] = [
  { value: 'steel', label: 'Structural Steel', density: 7850 },
  { value: 'stainless', label: 'Stainless Steel (304)', density: 8000 },
  { value: 'al_6061', label: 'Aluminum 6061', density: 2700 },
  { value: 'al_cast', label: 'Cast Aluminum', density: 2600 },
  { value: 'copper', label: 'Copper', density: 8960 },
  { value: 'brass', label: 'Brass', density: 8500 },
  { value: 'titanium', label: 'Titanium (Ti-6Al-4V)', density: 4430 },
  { value: 'iron', label: 'Cast Iron', density: 7200 },
  { value: 'abs', label: 'ABS Plastic', density: 1050 },
  { value: 'nylon', label: 'Nylon (PA6)', density: 1140 },
  { value: 'pla', label: 'PLA Plastic', density: 1240 },
  { value: 'wood_pine', label: 'Pine Wood', density: 550 },
  { value: 'concrete', label: 'Concrete', density: 2400 },
  { value: 'custom', label: 'Custom Density', density: 0 },
];

type Shape = 'bar_rect' | 'bar_round' | 'tube_round' | 'sheet' | 'hex_bar';

export function MaterialWeightCalculator() {
  const [material, setMaterial] = useState('steel');
  const [customDensity, setCustomDensity] = useState('');
  const [shape, setShape] = useState<Shape>('bar_rect');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [diameter, setDiameter] = useState('');
  const [wallThick, setWallThick] = useState('');
  const [thickness, setThickness] = useState('');
  const [length, setLength] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [result, setResult] = useState<{ unitWeight: string; totalWeight: string; volume: string } | null>(null);
  const [error, setError] = useState('');

  const matOptions = MATERIALS_DENSITY.map(m => ({ value: m.value, label: m.label }));
  const shapeOptions: { value: Shape; label: string }[] = [
    { value: 'bar_rect', label: 'Rectangular Bar' },
    { value: 'bar_round', label: 'Round Bar' },
    { value: 'tube_round', label: 'Round Tube / Pipe' },
    { value: 'sheet', label: 'Flat Sheet / Plate' },
    { value: 'hex_bar', label: 'Hex Bar' },
  ];

  const calculate = useCallback(() => {
    setError('');
    const matDef = MATERIALS_DENSITY.find(m => m.value === material);
    const density = material === 'custom' ? parseFloat(customDensity) : (matDef?.density ?? 0);
    if (isNaN(density) || density <= 0) return setError('Enter a valid density.');

    const L = parseFloat(length) / 1000; // mm to m
    if (isNaN(L) || L <= 0) return setError('Enter a valid length.');

    let area_m2 = 0;

    if (shape === 'bar_rect') {
      const w = parseFloat(width) / 1000;
      const h = parseFloat(height) / 1000;
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return setError('Enter width and height.');
      area_m2 = w * h;
    } else if (shape === 'bar_round') {
      const d = parseFloat(diameter) / 1000;
      if (isNaN(d) || d <= 0) return setError('Enter diameter.');
      area_m2 = Math.PI * (d / 2) ** 2;
    } else if (shape === 'tube_round') {
      const d = parseFloat(diameter) / 1000;
      const t = parseFloat(wallThick) / 1000;
      if (isNaN(d) || isNaN(t) || d <= 0 || t <= 0) return setError('Enter outer diameter and wall thickness.');
      if (t >= d / 2) return setError('Wall thickness must be less than radius.');
      const ri = d / 2 - t;
      area_m2 = Math.PI * ((d / 2) ** 2 - ri ** 2);
    } else if (shape === 'sheet') {
      const w = parseFloat(width) / 1000;
      const t = parseFloat(thickness) / 1000;
      if (isNaN(w) || isNaN(t) || w <= 0 || t <= 0) return setError('Enter width and thickness.');
      area_m2 = w * t;
    } else if (shape === 'hex_bar') {
      const d = parseFloat(diameter) / 1000; // across flats
      if (isNaN(d) || d <= 0) return setError('Enter hex size (across flats).');
      area_m2 = (3 * Math.sqrt(3) / 2) * (d / 2) ** 2;
    }

    const volume = area_m2 * L; // m³
    const mass = volume * density; // kg
    const qty = parseInt(quantity) || 1;

    setResult({
      unitWeight: formatNumber(mass, 4),
      totalWeight: formatNumber(mass * qty, 4),
      volume: formatNumber(volume * 1e6, 4), // cm³
    });

    addHistory({
      calculatorId: 'material-weight',
      calculatorTitle: 'Material Weight Calculator',
      inputs: { material: matDef?.label || 'Custom', shape, length: L * 1000 },
      result: `${formatNumber(mass, 4)} kg per piece`,
    });
  }, [material, customDensity, shape, width, height, diameter, wallThick, thickness, length, quantity]);

  const reset = () => { setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Weight size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Material Weight Calculator</h2>
          <p className="text-sm text-classic-muted">Calculate weight of standard material cross-sections</p>
        </div>
      </div>

      <FormulaDisplay
        formula="Mass = Volume × Density = Area × Length × ρ"
        variables={[
          { symbol: 'ρ', description: 'Material density', unit: 'kg/m³' },
          { symbol: 'A', description: 'Cross-sectional area', unit: 'm²' },
          { symbol: 'L', description: 'Length', unit: 'm' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput label="Material" value={material} onChange={setMaterial} options={matOptions} />
        {material === 'custom' && (
          <NumberInput label="Density" value={customDensity} onChange={setCustomDensity} unit="kg/m³" placeholder="e.g. 7850" />
        )}
        <SelectInput label="Cross-Section Shape" value={shape} onChange={(v) => { setShape(v as Shape); setResult(null); }} options={shapeOptions} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shape === 'bar_rect' && (
          <>
            <NumberInput label="Width" value={width} onChange={setWidth} unit="mm" placeholder="e.g. 50" />
            <NumberInput label="Height" value={height} onChange={setHeight} unit="mm" placeholder="e.g. 25" />
          </>
        )}
        {shape === 'bar_round' && (
          <NumberInput label="Diameter" value={diameter} onChange={setDiameter} unit="mm" placeholder="e.g. 20" />
        )}
        {shape === 'tube_round' && (
          <>
            <NumberInput label="Outer Diameter" value={diameter} onChange={setDiameter} unit="mm" placeholder="e.g. 50" />
            <NumberInput label="Wall Thickness" value={wallThick} onChange={setWallThick} unit="mm" placeholder="e.g. 3" />
          </>
        )}
        {shape === 'sheet' && (
          <>
            <NumberInput label="Width" value={width} onChange={setWidth} unit="mm" placeholder="e.g. 500" />
            <NumberInput label="Thickness" value={thickness} onChange={setThickness} unit="mm" placeholder="e.g. 6" />
          </>
        )}
        {shape === 'hex_bar' && (
          <NumberInput label="Hex Size (across flats)" value={diameter} onChange={setDiameter} unit="mm" placeholder="e.g. 19" />
        )}
        <NumberInput label="Length" value={length} onChange={setLength} unit="mm" placeholder="e.g. 1000" />
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ResultBox label="Weight per Piece" value={result.unitWeight} unit="kg" highlight />
          <ResultBox label="Total Weight" value={result.totalWeight} unit="kg" />
          <ResultBox label="Volume per Piece" value={result.volume} unit="cm³" />
        </div>
      )}
    </div>
  );
}
