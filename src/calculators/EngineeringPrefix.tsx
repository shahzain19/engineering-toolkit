'use client';

import React, { useState, useMemo } from 'react';
import { Hash } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';

const PREFIXES = [
  { symbol: 'Y', name: 'Yotta', exp: 24 },
  { symbol: 'Z', name: 'Zetta', exp: 21 },
  { symbol: 'E', name: 'Exa', exp: 18 },
  { symbol: 'P', name: 'Peta', exp: 15 },
  { symbol: 'T', name: 'Tera', exp: 12 },
  { symbol: 'G', name: 'Giga', exp: 9 },
  { symbol: 'M', name: 'Mega', exp: 6 },
  { symbol: 'k', name: 'Kilo', exp: 3 },
  { symbol: 'h', name: 'Hecto', exp: 2 },
  { symbol: 'da', name: 'Deca', exp: 1 },
  { symbol: '', name: '(base unit)', exp: 0 },
  { symbol: 'd', name: 'Deci', exp: -1 },
  { symbol: 'c', name: 'Centi', exp: -2 },
  { symbol: 'm', name: 'Milli', exp: -3 },
  { symbol: 'µ', name: 'Micro', exp: -6 },
  { symbol: 'n', name: 'Nano', exp: -9 },
  { symbol: 'p', name: 'Pico', exp: -12 },
  { symbol: 'f', name: 'Femto', exp: -15 },
  { symbol: 'a', name: 'Atto', exp: -18 },
];

export function EngineeringPrefixConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromPrefix, setFromPrefix] = useState('0'); // index
  const [toPrefix, setToPrefix] = useState('10'); // index (base unit)
  const [unit, setUnit] = useState('');

  const prefixOptions = PREFIXES.map((p, i) => ({
    value: String(i),
    label: p.symbol ? `${p.symbol} — ${p.name} (10^${p.exp})` : `(base unit) — 10^0`,
  }));

  const result = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '';
    const from = PREFIXES[parseInt(fromPrefix)];
    const to = PREFIXES[parseInt(toPrefix)];
    const baseValue = val * Math.pow(10, from.exp);
    const converted = baseValue / Math.pow(10, to.exp);
    if (Math.abs(converted) >= 1e15 || (Math.abs(converted) < 1e-12 && converted !== 0)) {
      return converted.toExponential(6);
    }
    return parseFloat(converted.toPrecision(10)).toString();
  }, [inputValue, fromPrefix, toPrefix]);

  const fromP = PREFIXES[parseInt(fromPrefix)];
  const toP = PREFIXES[parseInt(toPrefix)];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text">
          <Hash size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Engineering Prefix Converter</h2>
          <p className="text-sm text-classic-muted">Convert between SI metric prefixes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput label="Input Value" value={inputValue} onChange={setInputValue} placeholder="e.g. 3.3" />
        <NumberInput label="Unit (optional label)" value={unit} onChange={setUnit} placeholder="e.g. F, Hz, Ω" />
        <SelectInput label="From Prefix" value={fromPrefix} onChange={setFromPrefix} options={prefixOptions} />
        <SelectInput label="To Prefix" value={toPrefix} onChange={setToPrefix} options={prefixOptions} />
      </div>

      <ResultBox
        label={`Result (${toP.symbol}${unit || '?'})`}
        value={result || null}
        unit={`${toP.symbol}${unit}`}
        highlight={!!result}
      />

      {inputValue && result && (
        <div className="bg-classic-bg border border-classic-border p-4 font-mono text-sm text-classic-text text-center">
          {inputValue} {fromP.symbol}{unit} = <span className="font-bold text-classic-accent">{result} {toP.symbol}{unit}</span>
          <div className="text-xs text-classic-muted mt-1">= {(parseFloat(inputValue) * Math.pow(10, fromP.exp)).toExponential(4)} {unit} (base)</div>
        </div>
      )}

      {/* Reference table */}
      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Engineering Prefixes Reference</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-classic-border bg-classic-input">
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">Symbol</th>
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">Name</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">Power</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-classic-border">
              {PREFIXES.filter(p => p.exp !== 1 && p.exp !== -1 && p.exp !== 2 && p.exp !== -2).map((p) => (
                <tr key={p.exp} className="hover:bg-classic-input transition-colors">
                  <td className="px-3 py-2 font-mono font-bold text-classic-accent">{p.symbol || '—'}</td>
                  <td className="px-3 py-2 text-classic-text">{p.name}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-muted">10^{p.exp}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-muted">{(1 * Math.pow(10, p.exp)).toExponential(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
