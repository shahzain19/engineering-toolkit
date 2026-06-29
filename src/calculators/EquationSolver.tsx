'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, FunctionSquare } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { formatNumber, addHistory } from '@/utils/storage';

type Mode = 'linear' | 'quadratic' | 'system2';

export function EquationSolver() {
  const [mode, setMode] = useState<Mode>('linear');
  // Linear: ax + b = 0
  const [la, setLa] = useState('');
  const [lb, setLb] = useState('');
  // Quadratic: ax² + bx + c = 0
  const [qa, setQa] = useState('');
  const [qb, setQb] = useState('');
  const [qc, setQc] = useState('');
  // System 2x2: a1x + b1y = c1, a2x + b2y = c2
  const [s11, setS11] = useState('');
  const [s12, setS12] = useState('');
  const [s13, setS13] = useState('');
  const [s21, setS21] = useState('');
  const [s22, setS22] = useState('');
  const [s23, setS23] = useState('');

  const [result, setResult] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    setError('');
    setResult([]);
    setSteps([]);

    if (mode === 'linear') {
      const a = parseFloat(la), b = parseFloat(lb);
      if (isNaN(a) || isNaN(b)) return setError('Enter coefficients a and b.');
      if (a === 0) return setError('Coefficient a cannot be zero for a linear equation.');
      const x = -b / a;
      const r = formatNumber(x, 6);
      setResult([`x = ${r}`]);
      setSteps([`${a}x + ${b} = 0`, `${a}x = ${-b}`, `x = ${-b} / ${a}`, `x = ${r}`]);
      addHistory({ calculatorId: 'equation-solver', calculatorTitle: 'Equation Solver', inputs: { a, b }, result: `x = ${r}` });

    } else if (mode === 'quadratic') {
      const a = parseFloat(qa), b = parseFloat(qb), c = parseFloat(qc);
      if (isNaN(a) || isNaN(b) || isNaN(c)) return setError('Enter all three coefficients.');
      if (a === 0) return setError('Coefficient a cannot be zero for a quadratic equation.');
      const disc = b * b - 4 * a * c;
      const stepsArr = [
        `${a}x² + ${b}x + ${c} = 0`,
        `Discriminant Δ = b² − 4ac = ${b}² − 4(${a})(${c}) = ${formatNumber(disc, 4)}`,
      ];
      if (disc < 0) {
        const real = formatNumber(-b / (2 * a), 4);
        const imag = formatNumber(Math.sqrt(-disc) / (2 * a), 4);
        setResult([`x₁ = ${real} + ${imag}i`, `x₂ = ${real} − ${imag}i`]);
        stepsArr.push('Δ < 0 → two complex conjugate roots');
      } else if (disc === 0) {
        const x = formatNumber(-b / (2 * a), 6);
        setResult([`x = ${x} (double root)`]);
        stepsArr.push(`x = −b / 2a = ${x}`);
      } else {
        const x1 = formatNumber((-b + Math.sqrt(disc)) / (2 * a), 6);
        const x2 = formatNumber((-b - Math.sqrt(disc)) / (2 * a), 6);
        setResult([`x₁ = ${x1}`, `x₂ = ${x2}`]);
        stepsArr.push(`x = (−${b} ± √${formatNumber(disc, 4)}) / (2 × ${a})`);
        stepsArr.push(`x₁ = ${x1}`, `x₂ = ${x2}`);
      }
      setSteps(stepsArr);
      addHistory({ calculatorId: 'equation-solver', calculatorTitle: 'Equation Solver', inputs: { a, b, c }, result: `Δ = ${formatNumber(disc, 4)}` });

    } else {
      const a1 = parseFloat(s11), b1 = parseFloat(s12), c1 = parseFloat(s13);
      const a2 = parseFloat(s21), b2 = parseFloat(s22), c2 = parseFloat(s23);
      if ([a1, b1, c1, a2, b2, c2].some(isNaN)) return setError('Enter all six coefficients.');
      const det = a1 * b2 - a2 * b1;
      if (det === 0) return setError('System has no unique solution (determinant = 0).');
      const x = (c1 * b2 - c2 * b1) / det;
      const y = (a1 * c2 - a2 * c1) / det;
      setResult([`x = ${formatNumber(x, 6)}`, `y = ${formatNumber(y, 6)}`]);
      setSteps([
        `${a1}x + ${b1}y = ${c1}`,
        `${a2}x + ${b2}y = ${c2}`,
        `det = ${a1}×${b2} − ${a2}×${b1} = ${formatNumber(det, 4)}`,
        `x = (${c1}×${b2} − ${c2}×${b1}) / det`,
        `y = (${a1}×${c2} − ${a2}×${c1}) / det`,
      ]);
      addHistory({ calculatorId: 'equation-solver', calculatorTitle: 'Equation Solver', inputs: { a1, b1, c1, a2, b2, c2 }, result: `x=${formatNumber(x, 4)}, y=${formatNumber(y, 4)}` });
    }
  }, [mode, la, lb, qa, qb, qc, s11, s12, s13, s21, s22, s23]);

  const reset = () => { setResult([]); setSteps([]); setError(''); };

  const modes: { value: Mode; label: string }[] = [
    { value: 'linear', label: 'Linear (ax + b = 0)' },
    { value: 'quadratic', label: 'Quadratic (ax² + bx + c = 0)' },
    { value: 'system2', label: '2×2 System' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><FunctionSquare size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Equation Solver</h2>
          <p className="text-sm text-classic-muted">Solve linear, quadratic, and 2×2 linear systems</p>
        </div>
      </div>

      <div className="space-y-1">
        {modes.map((m) => (
          <button key={m.value} onClick={() => { setMode(m.value); reset(); }}
            className={`w-full text-left py-2 px-3 text-sm border transition-colors ${mode === m.value ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'linear' && (
        <div>
          <div className="bg-classic-bg border border-classic-border p-3 font-mono text-center text-classic-text mb-4">
            {la || 'a'}x + {lb || 'b'} = 0
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput label="Coefficient a" value={la} onChange={setLa} placeholder="e.g. 3" />
            <NumberInput label="Coefficient b" value={lb} onChange={setLb} placeholder="e.g. -9" />
          </div>
        </div>
      )}

      {mode === 'quadratic' && (
        <div>
          <div className="bg-classic-bg border border-classic-border p-3 font-mono text-center text-classic-text mb-4">
            {qa || 'a'}x² + {qb || 'b'}x + {qc || 'c'} = 0
          </div>
          <div className="grid grid-cols-3 gap-4">
            <NumberInput label="a (x²)" value={qa} onChange={setQa} placeholder="e.g. 1" />
            <NumberInput label="b (x)" value={qb} onChange={setQb} placeholder="e.g. -5" />
            <NumberInput label="c (const)" value={qc} onChange={setQc} placeholder="e.g. 6" />
          </div>
        </div>
      )}

      {mode === 'system2' && (
        <div>
          <div className="bg-classic-bg border border-classic-border p-3 font-mono text-xs text-classic-text mb-4 space-y-1">
            <div>{s11 || 'a₁'}x + {s12 || 'b₁'}y = {s13 || 'c₁'}</div>
            <div>{s21 || 'a₂'}x + {s22 || 'b₂'}y = {s23 || 'c₂'}</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <NumberInput label="a₁" value={s11} onChange={setS11} placeholder="e.g. 2" />
            <NumberInput label="b₁" value={s12} onChange={setS12} placeholder="e.g. 1" />
            <NumberInput label="c₁" value={s13} onChange={setS13} placeholder="e.g. 5" />
            <NumberInput label="a₂" value={s21} onChange={setS21} placeholder="e.g. 1" />
            <NumberInput label="b₂" value={s22} onChange={setS22} placeholder="e.g. -1" />
            <NumberInput label="c₂" value={s23} onChange={setS23} placeholder="e.g. 1" />
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3">{error}</div>}

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 py-2.5 px-6 bg-classic-accent text-classic-accent-text font-bold text-sm hover:bg-classic-accent-hover transition-colors border border-classic-border">
          Solve
        </button>
        <button onClick={reset} className="p-2.5 bg-classic-panel border border-classic-border text-classic-muted hover:text-classic-text transition-colors" title="Reset">
          <RefreshCw size={18} />
        </button>
      </div>

      {result.length > 0 && (
        <div className="space-y-2">
          {result.map((r, i) => (
            <div key={i} className="border border-classic-border bg-[#ffffcc] px-4 py-3 font-mono text-lg font-bold text-classic-text">{r}</div>
          ))}
        </div>
      )}

      {steps.length > 0 && (
        <div className="border border-classic-border bg-classic-panel overflow-hidden">
          <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
            <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Step-by-Step Solution</p>
          </div>
          <ol className="divide-y divide-classic-border">
            {steps.map((s, i) => (
              <li key={i} className="px-4 py-2 text-sm font-mono text-classic-text">
                <span className="text-classic-muted mr-3">{i + 1}.</span>{s}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
