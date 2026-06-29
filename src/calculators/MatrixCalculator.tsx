'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Grid3x3 } from 'lucide-react';

type Matrix = number[][];
type Op = 'add' | 'sub' | 'mul' | 'det' | 'transpose' | 'inverse';

function makeMatrix(r: number, c: number): string[][] {
  return Array.from({ length: r }, () => Array(c).fill(''));
}

function parseMatrix(m: string[][]): Matrix | null {
  const result: Matrix = [];
  for (const row of m) {
    const nums = row.map((v) => parseFloat(v));
    if (nums.some(isNaN)) return null;
    result.push(nums);
  }
  return result;
}

function matAdd(a: Matrix, b: Matrix): Matrix { return a.map((r, i) => r.map((v, j) => v + b[i][j])); }
function matSub(a: Matrix, b: Matrix): Matrix { return a.map((r, i) => r.map((v, j) => v - b[i][j])); }
function matMulCorrect(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => b[0].map((_, j) => row.reduce((sum, _, k) => sum + a[i][k] * b[k][j], 0)));
}
function transpose(a: Matrix): Matrix { return a[0].map((_, j) => a.map((row) => row[j])); }
function det2(m: Matrix): number { return m[0][0] * m[1][1] - m[0][1] * m[1][0]; }
function det3(m: Matrix): number {
  return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
    - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
    + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}
function inverse2(m: Matrix): Matrix | null {
  const d = det2(m);
  if (d === 0) return null;
  return [[m[1][1] / d, -m[0][1] / d], [-m[1][0] / d, m[0][0] / d]];
}
function fmt(n: number) { return parseFloat(n.toFixed(6)).toString(); }

function MatrixInput({ label, matrix, onChange, rows, cols }: { label: string; matrix: string[][]; onChange: (m: string[][]) => void; rows: number; cols: number; }) {
  const update = (r: number, c: number, v: string) => {
    const m = matrix.map((row) => [...row]);
    m[r][c] = v;
    onChange(m);
  };
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">{label} ({rows}×{cols})</p>
      <div className="border border-classic-border bg-classic-bg p-2 inline-block">
        {matrix.slice(0, rows).map((row, r) => (
          <div key={r} className="flex gap-1 mb-1">
            {row.slice(0, cols).map((val, c) => (
              <input
                key={c}
                type="number"
                value={val}
                onChange={(e) => update(r, c, e.target.value)}
                className="w-14 px-1.5 py-1 bg-classic-input border border-classic-border text-classic-text text-sm font-mono text-center focus:outline-none focus:border-classic-accent"
                placeholder="0"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MatrixDisplay({ label, matrix }: { label: string; matrix: Matrix }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">{label}</p>
      <div className="border border-classic-border bg-[#ffffcc] p-2 inline-block">
        {matrix.map((row, r) => (
          <div key={r} className="flex gap-2">
            {row.map((val, c) => (
              <span key={c} className="w-16 text-center font-mono text-sm text-classic-text font-bold">{fmt(val)}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MatrixCalculator() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matA, setMatA] = useState<string[][]>(makeMatrix(3, 3));
  const [matB, setMatB] = useState<string[][]>(makeMatrix(3, 3));
  const [op, setOp] = useState<Op>('add');
  const [result, setResult] = useState<{ matrix?: Matrix; scalar?: string } | null>(null);
  const [error, setError] = useState('');

  const needsB = op === 'add' || op === 'sub' || op === 'mul';
  const squareOnly = op === 'det' || op === 'inverse';

  const calculate = useCallback(() => {
    setError('');
    const A = parseMatrix(matA.slice(0, rows).map(r => r.slice(0, cols)));
    if (!A) return setError('Matrix A contains invalid values.');

    if (op === 'transpose') { setResult({ matrix: transpose(A) }); return; }
    if (op === 'det') {
      if (rows !== cols) return setError('Determinant requires a square matrix.');
      if (rows === 2) setResult({ scalar: fmt(det2(A)) });
      else if (rows === 3) setResult({ scalar: fmt(det3(A)) });
      else setError('Determinant supported for 2×2 and 3×3 only.');
      return;
    }
    if (op === 'inverse') {
      if (rows !== cols) return setError('Inverse requires a square matrix.');
      if (rows === 2) {
        const inv = inverse2(A);
        if (!inv) return setError('Matrix is singular (determinant = 0), no inverse.');
        setResult({ matrix: inv });
      } else { setError('Inverse supported for 2×2 only in this calculator.'); }
      return;
    }

    const B = parseMatrix(matB.slice(0, rows).map(r => r.slice(0, cols)));
    if (!B) return setError('Matrix B contains invalid values.');

    if (op === 'add') setResult({ matrix: matAdd(A, B) });
    else if (op === 'sub') setResult({ matrix: matSub(A, B) });
    else if (op === 'mul') {
      if (cols !== rows) return setError('For multiplication: A columns must equal B rows.');
      setResult({ matrix: matMulCorrect(A, B) });
    }
  }, [matA, matB, rows, cols, op]);

  const reset = () => { setMatA(makeMatrix(3, 3)); setMatB(makeMatrix(3, 3)); setResult(null); setError(''); };

  const ops: { value: Op; label: string }[] = [
    { value: 'add', label: 'A + B' }, { value: 'sub', label: 'A − B' },
    { value: 'mul', label: 'A × B' }, { value: 'transpose', label: 'Transpose A' },
    { value: 'det', label: 'Det(A)' }, { value: 'inverse', label: 'A⁻¹' },
  ];
  const sizeOpts = [2, 3].map(n => ({ value: String(n), label: `${n}` }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Grid3x3 size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Matrix Calculator</h2>
          <p className="text-sm text-classic-muted">Add, subtract, multiply, determinant, transpose, inverse</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Rows</label>
          <select value={rows} onChange={e => { setRows(parseInt(e.target.value)); setResult(null); }}
            className="px-2 py-1.5 bg-classic-input border border-classic-border text-classic-text text-sm focus:outline-none">
            {sizeOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Columns</label>
          <select value={cols} onChange={e => { setCols(parseInt(e.target.value)); setResult(null); }}
            className="px-2 py-1.5 bg-classic-input border border-classic-border text-classic-text text-sm focus:outline-none">
            {sizeOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Operation</p>
        <div className="grid grid-cols-3 gap-2">
          {ops.map((o) => (
            <button key={o.value} onClick={() => { setOp(o.value); setResult(null); setError(''); }}
              className={`py-2 px-2 text-sm font-medium font-mono border transition-colors ${op === o.value ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <MatrixInput label="Matrix A" matrix={matA} onChange={setMatA} rows={rows} cols={cols} />
        {needsB && <MatrixInput label="Matrix B" matrix={matB} onChange={setMatB} rows={rows} cols={cols} />}
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
        <div>
          {result.matrix && <MatrixDisplay label="Result" matrix={result.matrix} />}
          {result.scalar !== undefined && (
            <div className="border border-classic-border bg-[#ffffcc] px-4 py-3">
              <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-1">
                {op === 'det' ? 'Determinant' : 'Result'}
              </p>
              <span className="font-mono text-xl font-bold text-classic-text">{result.scalar}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
