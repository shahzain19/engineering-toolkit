'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, GitFork } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

export function DifferentialDriveCalculator() {
  const [wheelBase, setWheelBase] = useState('');
  const [wheelDiam, setWheelDiam] = useState('');
  const [leftRPM, setLeftRPM] = useState('');
  const [rightRPM, setRightRPM] = useState('');
  const [result, setResult] = useState<{
    vLeft: string; vRight: string; vLinear: string; vAngular: string; turnRadius: string;
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    setError('');
    const W = parseFloat(wheelBase) / 1000; // mm to m
    const D = parseFloat(wheelDiam) / 1000; // mm to m
    const Rl = parseFloat(leftRPM);
    const Rr = parseFloat(rightRPM);

    if (isNaN(W) || W <= 0) return setError('Enter a valid wheel base (distance between wheels).');
    if (isNaN(D) || D <= 0) return setError('Enter a valid wheel diameter.');
    if (isNaN(Rl) || isNaN(Rr)) return setError('Enter both left and right wheel RPM values.');

    const circ = Math.PI * D;
    const vL = (Rl / 60) * circ; // m/s
    const vR = (Rr / 60) * circ; // m/s
    const vLinear = (vL + vR) / 2;
    const vAngular = (vR - vL) / W; // rad/s

    let turnRadius = '∞ (straight)';
    if (Math.abs(vR - vL) > 1e-9) {
      const R = W * (vL + vR) / (2 * (vR - vL));
      turnRadius = formatNumber(R, 3) + ' m';
    }

    setResult({
      vLeft: formatNumber(vL, 4),
      vRight: formatNumber(vR, 4),
      vLinear: formatNumber(vLinear, 4),
      vAngular: formatNumber(vAngular, 4),
      turnRadius,
    });

    addHistory({
      calculatorId: 'differential-drive',
      calculatorTitle: 'Differential Drive',
      inputs: { wheelBase: W * 1000, wheelDiam: D * 1000, leftRPM: Rl, rightRPM: Rr },
      result: `v=${formatNumber(vLinear, 3)} m/s, ω=${formatNumber(vAngular, 3)} rad/s`,
    });
  }, [wheelBase, wheelDiam, leftRPM, rightRPM]);

  const reset = () => { setWheelBase(''); setWheelDiam(''); setLeftRPM(''); setRightRPM(''); setResult(null); setError(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><GitFork size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Differential Drive Calculator</h2>
          <p className="text-sm text-classic-muted">Robot kinematics for two-wheel differential drive</p>
        </div>
      </div>

      <FormulaDisplay
        formula="v = (vL + vR) / 2    ω = (vR - vL) / W"
        description="Linear velocity and angular velocity for differential drive"
        variables={[
          { symbol: 'v', description: 'Linear velocity', unit: 'm/s' },
          { symbol: 'ω', description: 'Angular velocity', unit: 'rad/s' },
          { symbol: 'vL/vR', description: 'Left/Right wheel speed', unit: 'm/s' },
          { symbol: 'W', description: 'Wheel base (track width)', unit: 'm' },
        ]}
      />

      {/* Robot top-view diagram */}
      <div className="border border-classic-border bg-classic-bg p-4 flex justify-center">
        <svg viewBox="0 0 200 120" className="w-48 h-28">
          {/* Robot body */}
          <rect x="60" y="30" width="80" height="60" fill="none" stroke="#999" strokeWidth="2" />
          {/* Left wheel */}
          <rect x="40" y="40" width="20" height="40" fill="none" stroke="#333" strokeWidth="2" />
          <text x="50" y="65" textAnchor="middle" fontSize="9" fill="#666">L</text>
          {/* Right wheel */}
          <rect x="140" y="40" width="20" height="40" fill="none" stroke="#333" strokeWidth="2" />
          <text x="150" y="65" textAnchor="middle" fontSize="9" fill="#666">R</text>
          {/* Front arrow */}
          <line x1="100" y1="30" x2="100" y2="10" stroke="#333" strokeWidth="1.5" markerEnd="url(#arr)" />
          <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#333"/></marker></defs>
          <text x="100" y="8" textAnchor="middle" fontSize="8" fill="#999">Front</text>
          {/* Wheel base label */}
          <line x1="60" y1="110" x2="140" y2="110" stroke="#999" strokeWidth="1" strokeDasharray="3,2" />
          <text x="100" y="118" textAnchor="middle" fontSize="8" fill="#999">W = {wheelBase || '?'} mm</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput label="Wheel Base (W)" value={wheelBase} onChange={setWheelBase} unit="mm" placeholder="e.g. 200" />
        <NumberInput label="Wheel Diameter" value={wheelDiam} onChange={setWheelDiam} unit="mm" placeholder="e.g. 65" />
        <NumberInput label="Left Wheel Speed" value={leftRPM} onChange={setLeftRPM} unit="RPM" placeholder="e.g. 100" />
        <NumberInput label="Right Wheel Speed" value={rightRPM} onChange={setRightRPM} unit="RPM" placeholder="e.g. 150" />
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
            <ResultBox label="Left Wheel Speed" value={result.vLeft} unit="m/s" />
            <ResultBox label="Right Wheel Speed" value={result.vRight} unit="m/s" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="Linear Velocity" value={result.vLinear} unit="m/s" highlight />
            <ResultBox label="Angular Velocity" value={result.vAngular} unit="rad/s" highlight />
          </div>
          <div className="border border-classic-border bg-classic-bg px-4 py-3 text-sm text-classic-text font-mono">
            Turn Radius: <span className="font-bold text-classic-accent">{result.turnRadius}</span>
          </div>
        </div>
      )}
    </div>
  );
}
