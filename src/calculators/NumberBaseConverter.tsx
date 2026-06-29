'use client';

import React, { useState, useMemo } from 'react';
import { Binary } from 'lucide-react';
import { addHistory } from '@/utils/storage';

function toBin(n: number): string { return n < 0 ? '-' + ((-n) >>> 0).toString(2) : (n >>> 0).toString(2); }
function toOct(n: number): string { return n < 0 ? '-' + ((-n) >>> 0).toString(8) : (n >>> 0).toString(8); }

interface BaseInput { dec: string; bin: string; hex: string; oct: string; }
type BaseKey = keyof BaseInput;

export function NumberBaseConverter() {
  const [inputs, setInputs] = useState<BaseInput>({ dec: '', bin: '', hex: '', oct: '' });
  const [activeBase, setActiveBase] = useState<BaseKey>('dec');
  const [error, setError] = useState('');

  const derived = useMemo(() => {
    const v = inputs[activeBase].trim().toUpperCase();
    if (!v || v === '-') return { dec: '', bin: '', hex: '', oct: '' };

    try {
      let n: number;
      if (activeBase === 'dec') n = parseInt(v, 10);
      else if (activeBase === 'bin') n = parseInt(v, 2);
      else if (activeBase === 'hex') n = parseInt(v, 16);
      else n = parseInt(v, 8);

      if (isNaN(n)) return null;

      return {
        dec: String(n),
        bin: toBin(n),
        hex: (n >>> 0).toString(16).toUpperCase(),
        oct: toOct(n),
      };
    } catch {
      return null;
    }
  }, [inputs, activeBase]);

  const handleChange = (base: BaseKey, val: string) => {
    setError('');
    setActiveBase(base);
    setInputs({ dec: '', bin: '', hex: '', oct: '', [base]: val });
  };

  const handleSave = () => {
    if (!derived) return;
    addHistory({
      calculatorId: 'number-base-converter',
      calculatorTitle: 'Number Base Converter',
      inputs: { [activeBase]: inputs[activeBase] },
      result: `DEC:${derived.dec} BIN:${derived.bin} HEX:${derived.hex} OCT:${derived.oct}`,
    });
  };

  const fields: { key: BaseKey; label: string; prefix: string; placeholder: string; pattern: string }[] = [
    { key: 'dec', label: 'Decimal', prefix: 'DEC', placeholder: 'e.g. 255', pattern: '[0-9\\-]*' },
    { key: 'bin', label: 'Binary', prefix: 'BIN', placeholder: 'e.g. 11111111', pattern: '[01]*' },
    { key: 'hex', label: 'Hexadecimal', prefix: 'HEX', placeholder: 'e.g. FF', pattern: '[0-9A-Fa-f]*' },
    { key: 'oct', label: 'Octal', prefix: 'OCT', placeholder: 'e.g. 377', pattern: '[0-7]*' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Binary size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Binary ↔ Decimal ↔ Hex Converter</h2>
          <p className="text-sm text-classic-muted">Convert numbers between bases in real-time</p>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map(({ key, label, prefix, placeholder, pattern }) => {
          const displayVal = activeBase === key ? inputs[key] : (derived?.[key] ?? '');
          const isActive = activeBase === key;
          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-classic-text uppercase tracking-wider">{label}</label>
              <div className="flex">
                <span className="px-3 py-1.5 bg-classic-accent text-classic-accent-text text-xs font-mono font-bold border border-classic-border border-r-0 flex items-center w-12 justify-center">
                  {prefix}
                </span>
                <input
                  type="text"
                  value={displayVal}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  pattern={pattern}
                  className={`flex-1 px-3 py-1.5 bg-classic-input border text-classic-text text-sm font-mono focus:outline-none focus:border-classic-accent transition-colors ${isActive ? 'border-classic-accent bg-[#ffffcc]' : 'border-classic-border'}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {error && <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3">{error}</div>}

      {derived && derived.dec && (
        <div className="border border-classic-border bg-classic-bg p-4 space-y-2">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Bit Representation (8-bit groups)</p>
          <p className="font-mono text-classic-text text-sm break-all">
            {derived.bin.match(/.{1,8}/g)?.join(' ') || derived.bin}
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs mt-2">
            <div><span className="text-classic-muted">Decimal: </span><span className="font-mono font-bold text-classic-text">{parseInt(derived.dec).toLocaleString()}</span></div>
            <div><span className="text-classic-muted">Hex: </span><span className="font-mono font-bold text-classic-accent">0x{derived.hex}</span></div>
            <div><span className="text-classic-muted">Bits: </span><span className="font-mono font-bold text-classic-text">{derived.bin.length}</span></div>
            <div><span className="text-classic-muted">Bytes: </span><span className="font-mono font-bold text-classic-text">{Math.ceil(derived.bin.length / 8)}</span></div>
          </div>
        </div>
      )}

      <button onClick={handleSave} disabled={!derived?.dec} className="w-full py-2.5 px-6 bg-classic-accent text-classic-accent-text font-bold text-sm hover:bg-classic-accent-hover transition-colors border border-classic-border disabled:opacity-40">
        Save to History
      </button>

      {/* Quick reference */}
      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Common Values</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-classic-border bg-classic-input">
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">DEC</th>
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">HEX</th>
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">BIN</th>
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">OCT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-classic-border">
              {[0, 1, 2, 4, 8, 10, 15, 16, 32, 64, 127, 128, 255].map((n) => (
                <tr key={n} className="hover:bg-classic-input transition-colors cursor-pointer"
                    onClick={() => handleChange('dec', String(n))}>
                  <td className="px-3 py-1.5 text-classic-text">{n}</td>
                  <td className="px-3 py-1.5 text-classic-accent">0x{n.toString(16).toUpperCase()}</td>
                  <td className="px-3 py-1.5 text-classic-muted">{toBin(n)}</td>
                  <td className="px-3 py-1.5 text-classic-muted">{n.toString(8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
