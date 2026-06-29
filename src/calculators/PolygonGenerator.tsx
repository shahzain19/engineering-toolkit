'use client';

import React, { useState, useMemo } from 'react';
import { Pentagon } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber } from '@/utils/storage';

export function PolygonGenerator() {
  const [sides, setSides] = useState('6');
  const [sizeMode, setSizeMode] = useState<'circumradius' | 'inradius' | 'side'>('circumradius');
  const [sizeValue, setSizeValue] = useState('50');
  const [rotation, setRotation] = useState('0');

  const n = Math.max(3, Math.min(32, parseInt(sides) || 6));

  const computed = useMemo(() => {
    const sv = parseFloat(sizeValue);
    if (isNaN(sv) || sv <= 0) return null;

    let R = 0; // circumradius
    if (sizeMode === 'circumradius') R = sv;
    else if (sizeMode === 'inradius') R = sv / Math.cos(Math.PI / n);
    else R = sv / (2 * Math.sin(Math.PI / n));

    const r = R * Math.cos(Math.PI / n); // inradius
    const a = 2 * R * Math.sin(Math.PI / n); // side length
    const perimeter = n * a;
    const area = 0.5 * n * a * r;
    const interiorAngle = ((n - 2) * 180) / n;
    const exteriorAngle = 360 / n;

    const rotRad = (parseFloat(rotation) || 0) * (Math.PI / 180);
    const vertices = Array.from({ length: n }, (_, i) => {
      const angle = rotRad + (2 * Math.PI * i) / n;
      return { x: R * Math.cos(angle), y: R * Math.sin(angle) };
    });

    return { R, r, a, perimeter, area, interiorAngle, exteriorAngle, vertices };
  }, [n, sizeMode, sizeValue, rotation]);

  const svgSize = 200;
  const pad = 20;
  const scale = computed ? (svgSize / 2 - pad) / computed.R : 1;
  const cx = svgSize / 2, cy = svgSize / 2;

  const polygonNames: Record<number, string> = {
    3: 'Triangle', 4: 'Square', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon',
    8: 'Octagon', 9: 'Nonagon', 10: 'Decagon', 12: 'Dodecagon', 16: 'Hexadecagon',
  };
  const shapeName = polygonNames[n] ?? `${n}-gon`;

  const sizeModes: { value: typeof sizeMode; label: string }[] = [
    { value: 'circumradius', label: 'Circumradius (R)' },
    { value: 'inradius', label: 'Inradius (r)' },
    { value: 'side', label: 'Side length (a)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Pentagon size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Polygon Generator</h2>
          <p className="text-sm text-classic-muted">Regular polygon geometry, vertices, area, and dimensions</p>
        </div>
      </div>

      <FormulaDisplay
        formula="Area = ½ × n × a × r    Perimeter = n × a"
        description="Regular polygon — n sides, side length a, inradius r"
        variables={[
          { symbol: 'R', description: 'Circumradius (center to vertex)', unit: 'mm' },
          { symbol: 'r', description: 'Inradius (center to side midpoint)', unit: 'mm' },
          { symbol: 'a', description: 'Side length', unit: 'mm' },
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Number of Sides</label>
          <input type="range" min={3} max={32} value={n}
            onChange={e => setSides(e.target.value)}
            className="w-full accent-current" />
          <div className="flex justify-between text-xs text-classic-muted">
            <span>3</span><span className="font-bold text-classic-accent">{n} ({shapeName})</span><span>32</span>
          </div>
        </div>
        <NumberInput label="Rotation" value={rotation} onChange={setRotation} unit="°" placeholder="0" />
      </div>

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Define size by</p>
        <div className="grid grid-cols-3 gap-2">
          {sizeModes.map(m => (
            <button key={m.value} onClick={() => setSizeMode(m.value)}
              className={`py-2 px-2 text-xs font-medium border transition-colors ${sizeMode === m.value ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
              {m.label}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <NumberInput label={sizeModes.find(m => m.value === sizeMode)?.label ?? 'Size'} value={sizeValue} onChange={setSizeValue} unit="mm" placeholder="e.g. 50" />
        </div>
      </div>

      {computed && (
        <div className="space-y-4">
          {/* SVG Preview */}
          <div className="border border-classic-border bg-classic-bg p-4 flex justify-center">
            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-48 h-48">
              <circle cx={cx} cy={cy} r={computed.R * scale} fill="none" stroke="#eee" strokeWidth="1" strokeDasharray="3,2" />
              <circle cx={cx} cy={cy} r={computed.r * scale} fill="none" stroke="#ccc" strokeWidth="1" strokeDasharray="2,2" />
              <polygon
                points={computed.vertices.map(v => `${cx + v.x * scale},${cy - v.y * scale}`).join(' ')}
                fill="#f5f5f5" stroke="#333" strokeWidth="1.5"
              />
              {computed.vertices.map((v, i) => (
                <circle key={i} cx={cx + v.x * scale} cy={cy - v.y * scale} r="3" fill="#333" />
              ))}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="Circumradius (R)" value={formatNumber(computed.R, 4)} unit="mm" highlight />
            <ResultBox label="Inradius (r)" value={formatNumber(computed.r, 4)} unit="mm" />
            <ResultBox label="Side Length (a)" value={formatNumber(computed.a, 4)} unit="mm" />
            <ResultBox label="Perimeter" value={formatNumber(computed.perimeter, 3)} unit="mm" />
            <ResultBox label="Area" value={formatNumber(computed.area, 3)} unit="mm²" />
            <ResultBox label="Interior Angle" value={formatNumber(computed.interiorAngle, 4)} unit="°" />
          </div>

          {/* Vertex table */}
          <div className="border border-classic-border bg-classic-panel overflow-hidden">
            <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
              <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Vertex Coordinates (from center)</p>
            </div>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-xs font-mono">
                <thead className="sticky top-0">
                  <tr className="border-b border-classic-border bg-classic-input">
                    <th className="text-left px-3 py-2 text-classic-muted font-semibold">Vertex</th>
                    <th className="text-right px-3 py-2 text-classic-muted font-semibold">X (mm)</th>
                    <th className="text-right px-3 py-2 text-classic-muted font-semibold">Y (mm)</th>
                    <th className="text-right px-3 py-2 text-classic-muted font-semibold">Angle (°)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-classic-border">
                  {computed.vertices.map((v, i) => (
                    <tr key={i} className="hover:bg-classic-input transition-colors">
                      <td className="px-3 py-2 text-classic-accent font-bold">V{i + 1}</td>
                      <td className="px-3 py-2 text-right text-classic-text">{formatNumber(v.x, 4)}</td>
                      <td className="px-3 py-2 text-right text-classic-text">{formatNumber(v.y, 4)}</td>
                      <td className="px-3 py-2 text-right text-classic-muted">{formatNumber((parseFloat(rotation) || 0) + (360 / n) * i, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
