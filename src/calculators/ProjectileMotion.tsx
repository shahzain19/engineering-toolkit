'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

export function ProjectileMotionCalculator() {
  const [velocity, setVelocity] = useState('');
  const [angle, setAngle] = useState('');
  const [height, setHeight] = useState('0');
  const [gravity, setGravity] = useState('9.80665');
  const [result, setResult] = useState<{
    range: string; maxHeight: string; timeOfFlight: string;
    vx: string; vy: string;
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    setError('');
    const v0 = parseFloat(velocity);
    const deg = parseFloat(angle);
    const h0 = parseFloat(height);
    const g = parseFloat(gravity);

    if (isNaN(v0) || v0 < 0) return setError('Enter a valid initial velocity.');
    if (isNaN(deg) || deg < 0 || deg > 90) return setError('Angle must be between 0° and 90°.');
    if (isNaN(h0)) return setError('Enter a valid launch height (0 for ground level).');
    if (isNaN(g) || g <= 0) return setError('Enter a valid gravitational acceleration.');

    const rad = (deg * Math.PI) / 180;
    const vx = v0 * Math.cos(rad);
    const vy = v0 * Math.sin(rad);

    // Time of flight: solve 0 = h0 + vy*t - 0.5*g*t²
    // 0.5g·t² - vy·t - h0 = 0
    const a_q = 0.5 * g;
    const b_q = -vy;
    const c_q = -h0;
    const disc = b_q * b_q - 4 * a_q * c_q;
    if (disc < 0) return setError('No real solution — check inputs.');
    const t = (-b_q + Math.sqrt(disc)) / (2 * a_q);

    const range = vx * t;
    const maxHeight = h0 + (vy * vy) / (2 * g);
    const timeApex = vy / g;

    setResult({
      range: formatNumber(range, 4),
      maxHeight: formatNumber(maxHeight, 4),
      timeOfFlight: formatNumber(t, 4),
      vx: formatNumber(vx, 4),
      vy: formatNumber(vy, 4),
    });

    addHistory({
      calculatorId: 'projectile-motion',
      calculatorTitle: 'Projectile Motion',
      inputs: { v0, angle: deg, h0, g },
      result: `Range=${formatNumber(range, 3)} m, H_max=${formatNumber(maxHeight, 3)} m, t=${formatNumber(t, 3)} s`,
    });
  }, [velocity, angle, height, gravity]);

  const reset = () => { setVelocity(''); setAngle(''); setHeight('0'); setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><TrendingUp size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Projectile Motion Calculator</h2>
          <p className="text-sm text-classic-muted">Calculate range, max height, and time of flight</p>
        </div>
      </div>

      <FormulaDisplay
        formula="R = v₀cos(θ)·t    H_max = h₀ + v₀²sin²(θ)/(2g)"
        variables={[
          { symbol: 'R', description: 'Horizontal range', unit: 'm' },
          { symbol: 'H_max', description: 'Maximum height', unit: 'm' },
          { symbol: 'v₀', description: 'Initial speed', unit: 'm/s' },
          { symbol: 'θ', description: 'Launch angle', unit: '°' },
          { symbol: 'g', description: 'Gravity (9.806 m/s²)', unit: 'm/s²' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput label="Initial Velocity (v₀)" value={velocity} onChange={setVelocity} unit="m/s" placeholder="e.g. 20" />
        <NumberInput label="Launch Angle (θ)" value={angle} onChange={setAngle} unit="°" placeholder="e.g. 45" />
        <NumberInput label="Launch Height (h₀)" value={height} onChange={setHeight} unit="m" placeholder="e.g. 0" />
        <NumberInput label="Gravity (g)" value={gravity} onChange={setGravity} unit="m/s²" placeholder="9.80665" />
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
          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="Horizontal Range" value={result.range} unit="m" highlight />
            <ResultBox label="Max Height" value={result.maxHeight} unit="m" highlight />
            <ResultBox label="Time of Flight" value={result.timeOfFlight} unit="s" />
            <ResultBox label="Horizontal Velocity (vx)" value={result.vx} unit="m/s" />
          </div>

          {/* Trajectory sketch */}
          {result && (() => {
            const pts: string[] = [];
            const steps = 40;
            const v0 = parseFloat(velocity);
            const deg = parseFloat(angle);
            const h0 = parseFloat(height) || 0;
            const g = parseFloat(gravity) || 9.8;
            const rad = (deg * Math.PI) / 180;
            const vx = v0 * Math.cos(rad);
            const vy = v0 * Math.sin(rad);
            const T = parseFloat(result.timeOfFlight);
            const R = parseFloat(result.range);
            const Hmax = parseFloat(result.maxHeight);
            const svgW = 200, svgH = 80;
            for (let i = 0; i <= steps; i++) {
              const t = (i / steps) * T;
              const x = vx * t;
              const y = h0 + vy * t - 0.5 * g * t * t;
              const sx = (x / (R || 1)) * (svgW - 20) + 10;
              const sy = svgH - 5 - ((y / (Hmax || 1)) * (svgH - 20));
              pts.push(`${sx},${Math.max(5, sy)}`);
            }
            return (
              <div className="border border-classic-border bg-classic-bg p-2">
                <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Trajectory</p>
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-20">
                  <line x1="10" y1={svgH - 5} x2={svgW - 5} y2={svgH - 5} stroke="#ccc" strokeWidth="1" />
                  <line x1="10" y1="5" x2="10" y2={svgH - 5} stroke="#ccc" strokeWidth="1" />
                  <polyline points={pts.join(' ')} fill="none" stroke="#333" strokeWidth="2" />
                  <circle cx="10" cy={svgH - 5 - ((h0 / (parseFloat(result.maxHeight) || 1)) * (svgH - 20))} r="3" fill="#333" />
                </svg>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
