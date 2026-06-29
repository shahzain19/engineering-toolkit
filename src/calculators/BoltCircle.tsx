'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Circle } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

interface HolePoint { n: number; x: number; y: number; angle: number; }

export function BoltCircleCalculator() {
  const [pcd, setPcd] = useState('');
  const [numHoles, setNumHoles] = useState('6');
  const [startAngle, setStartAngle] = useState('0');
  const [centerX, setCenterX] = useState('0');
  const [centerY, setCenterY] = useState('0');
  const [holeSize, setHoleSize] = useState('');
  const [points, setPoints] = useState<HolePoint[]>([]);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    setError('');
    const D = parseFloat(pcd);
    const n = parseInt(numHoles);
    const a0 = parseFloat(startAngle) || 0;
    const cx = parseFloat(centerX) || 0;
    const cy = parseFloat(centerY) || 0;

    if (isNaN(D) || D <= 0) return setError('Enter a valid PCD (bolt circle diameter).');
    if (isNaN(n) || n < 2 || n > 72) return setError('Number of holes must be between 2 and 72.');

    const R = D / 2;
    const pts: HolePoint[] = [];
    for (let i = 0; i < n; i++) {
      const angleDeg = a0 + (360 / n) * i;
      const angleRad = (angleDeg * Math.PI) / 180;
      pts.push({
        n: i + 1,
        x: cx + R * Math.cos(angleRad),
        y: cy + R * Math.sin(angleRad),
        angle: angleDeg % 360,
      });
    }
    setPoints(pts);

    addHistory({
      calculatorId: 'bolt-circle',
      calculatorTitle: 'Bolt Circle Calculator',
      inputs: { PCD: D, holes: n, startAngle: a0 },
      result: `${n} holes on Ø${D} mm PCD`,
    });
  }, [pcd, numHoles, startAngle, centerX, centerY]);

  const reset = () => { setPoints([]); setError(''); };

  // SVG preview
  const svgSize = 200;
  const R_pcd = parseFloat(pcd) / 2;
  const scale = R_pcd > 0 ? (svgSize / 2 - 20) / R_pcd : 1;
  const cx_svg = svgSize / 2;
  const cy_svg = svgSize / 2;
  const holeR = holeSize ? (parseFloat(holeSize) / 2) * scale : 4;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Circle size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Bolt Circle Calculator</h2>
          <p className="text-sm text-classic-muted">Calculate X/Y coordinates for bolt holes on a PCD</p>
        </div>
      </div>

      <FormulaDisplay
        formula="X = cx + (D/2) × cos(θ)    Y = cy + (D/2) × sin(θ)"
        description="Hole coordinates on bolt circle (PCD = Pitch Circle Diameter)"
        variables={[
          { symbol: 'D', description: 'Pitch Circle Diameter (PCD)', unit: 'mm' },
          { symbol: 'θ', description: 'Angle for each hole', unit: '°' },
          { symbol: 'n', description: 'Number of holes' },
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput label="PCD (Bolt Circle Ø)" value={pcd} onChange={setPcd} unit="mm" placeholder="e.g. 100" />
        <NumberInput label="Number of Holes" value={numHoles} onChange={setNumHoles} placeholder="e.g. 6" />
        <NumberInput label="Start Angle" value={startAngle} onChange={setStartAngle} unit="°" placeholder="e.g. 0" />
        <NumberInput label="Hole Diameter (optional)" value={holeSize} onChange={setHoleSize} unit="mm" placeholder="e.g. 10" />
        <NumberInput label="Center X" value={centerX} onChange={setCenterX} unit="mm" placeholder="0" />
        <NumberInput label="Center Y" value={centerY} onChange={setCenterY} unit="mm" placeholder="0" />
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

      {points.length > 0 && (
        <div className="space-y-4">
          {/* SVG Preview */}
          <div className="border border-classic-border bg-classic-bg p-4 flex justify-center">
            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-48 h-48">
              {/* PCD circle */}
              <circle cx={cx_svg} cy={cy_svg} r={R_pcd * scale} fill="none" stroke="#ccc" strokeWidth="1" strokeDasharray="4,3" />
              {/* Center cross */}
              <line x1={cx_svg - 6} y1={cy_svg} x2={cx_svg + 6} y2={cy_svg} stroke="#999" strokeWidth="1" />
              <line x1={cx_svg} y1={cy_svg - 6} x2={cx_svg} y2={cy_svg + 6} stroke="#999" strokeWidth="1" />
              {/* Holes */}
              {points.map((p) => {
                const sx = cx_svg + (p.x - (parseFloat(centerX) || 0)) * scale;
                const sy = cy_svg - (p.y - (parseFloat(centerY) || 0)) * scale;
                return (
                  <g key={p.n}>
                    <circle cx={sx} cy={sy} r={Math.max(holeR, 3)} fill="white" stroke="#333" strokeWidth="1.5" />
                    <text x={sx} y={sy + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize="6" fill="#333">{p.n}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Coordinates table */}
          <div className="border border-classic-border bg-classic-panel overflow-hidden">
            <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
              <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Hole Coordinates</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-classic-border bg-classic-input">
                    <th className="text-left px-3 py-2 text-classic-muted font-semibold">Hole</th>
                    <th className="text-right px-3 py-2 text-classic-muted font-semibold">Angle (°)</th>
                    <th className="text-right px-3 py-2 text-classic-muted font-semibold">X (mm)</th>
                    <th className="text-right px-3 py-2 text-classic-muted font-semibold">Y (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-classic-border">
                  {points.map((p) => (
                    <tr key={p.n} className="hover:bg-classic-input transition-colors">
                      <td className="px-3 py-2 text-classic-accent font-bold">#{p.n}</td>
                      <td className="px-3 py-2 text-right text-classic-muted">{formatNumber(p.angle, 3)}</td>
                      <td className="px-3 py-2 text-right text-classic-text">{formatNumber(p.x, 4)}</td>
                      <td className="px-3 py-2 text-right text-classic-text">{formatNumber(p.y, 4)}</td>
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
