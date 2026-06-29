'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

const PREFIXES = [
  { symbol: 'Y', name: 'Yotta', exp: 24, example: '~mass of Earth = 5.97 Yg' },
  { symbol: 'Z', name: 'Zetta', exp: 21, example: '' },
  { symbol: 'E', name: 'Exa', exp: 18, example: '~1 Exabyte of data' },
  { symbol: 'P', name: 'Peta', exp: 15, example: '~1 Petabyte = 1000 TB' },
  { symbol: 'T', name: 'Tera', exp: 12, example: '1 THz, ~1 TB SSD' },
  { symbol: 'G', name: 'Giga', exp: 9, example: '2.4 GHz Wi-Fi, 4 GB RAM' },
  { symbol: 'M', name: 'Mega', exp: 6, example: '100 MHz CPU clock (old), 1 MW power' },
  { symbol: 'k', name: 'Kilo', exp: 3, example: '1 kΩ resistor, 1 km distance' },
  { symbol: 'h', name: 'Hecto', exp: 2, example: '1 hPa = 100 Pa (weather)' },
  { symbol: 'da', name: 'Deca', exp: 1, example: 'Rarely used in engineering' },
  { symbol: '', name: '(base)', exp: 0, example: '1 V, 1 A, 1 m, 1 Hz' },
  { symbol: 'd', name: 'Deci', exp: -1, example: '1 dB (decibel uses this)' },
  { symbol: 'c', name: 'Centi', exp: -2, example: '1 cm = 0.01 m' },
  { symbol: 'm', name: 'Milli', exp: -3, example: '20 mA LED current, 1 mH inductor' },
  { symbol: 'µ', name: 'Micro', exp: -6, example: '10 µF capacitor, 1 µs pulse' },
  { symbol: 'n', name: 'Nano', exp: -9, example: '100 nF decoupling cap, 10 nm chip' },
  { symbol: 'p', name: 'Pico', exp: -12, example: '22 pF crystal load cap' },
  { symbol: 'f', name: 'Femto', exp: -15, example: '~1 fF parasitic capacitance' },
  { symbol: 'a', name: 'Atto', exp: -18, example: 'Quantum physics domain' },
  { symbol: 'z', name: 'Zepto', exp: -21, example: 'Fundamental particle physics' },
  { symbol: 'y', name: 'Yocto', exp: -24, example: 'Smallest SI prefix' },
];

export function SIPrefixReference() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><BookOpen size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">SI Prefix Reference</h2>
          <p className="text-sm text-classic-muted">Complete table of all SI metric prefixes with engineering examples</p>
        </div>
      </div>

      <div className="bg-classic-bg border border-classic-border p-3 text-xs text-classic-muted">
        The International System of Units (SI) defines 20 prefixes spanning from 10⁻²⁴ to 10²⁴. Engineering typically uses every 3rd power (µ, m, k, M, G, T…).
      </div>

      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-classic-border bg-classic-input">
                <th className="text-center px-3 py-2 text-classic-muted font-semibold text-xs uppercase w-10">Symbol</th>
                <th className="text-left px-3 py-2 text-classic-muted font-semibold text-xs uppercase">Name</th>
                <th className="text-center px-3 py-2 text-classic-muted font-semibold text-xs uppercase">Power</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold text-xs uppercase">Factor</th>
                <th className="text-left px-3 py-2 text-classic-muted font-semibold text-xs uppercase hidden sm:table-cell">Engineering Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-classic-border">
              {PREFIXES.map((p) => {
                const isCommon = [9, 6, 3, -3, -6, -9, -12].includes(p.exp);
                return (
                  <tr key={p.exp} className={`hover:bg-classic-input transition-colors ${isCommon ? 'bg-classic-input/50' : ''}`}>
                    <td className="px-3 py-2 text-center">
                      <span className={`font-mono font-bold text-base ${isCommon ? 'text-classic-accent' : 'text-classic-muted'}`}>
                        {p.symbol || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-classic-text font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-center font-mono text-classic-muted text-xs">10<sup>{p.exp}</sup></td>
                    <td className="px-3 py-2 text-right font-mono text-classic-muted text-xs">
                      {p.exp >= 0
                        ? p.exp <= 9 ? (Math.pow(10, p.exp)).toLocaleString() : `10^${p.exp}`
                        : p.exp >= -9 ? (Math.pow(10, p.exp)).toFixed(Math.abs(p.exp)) : `10^${p.exp}`}
                    </td>
                    <td className="px-3 py-2 text-classic-muted text-xs hidden sm:table-cell">{p.example}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common multiplier quick reference */}
      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Common Engineering Prefix Conversions</p>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {[
            '1 GHz = 1,000 MHz = 1,000,000 kHz',
            '1 MΩ = 1,000 kΩ = 1,000,000 Ω',
            '1 mA = 1,000 µA = 1,000,000 nA',
            '1 µF = 1,000 nF = 1,000,000 pF',
            '1 km = 1,000 m = 100,000 cm',
            '1 kW = 1,000 W = 1,000,000 mW',
          ].map((line, i) => (
            <div key={i} className="text-classic-muted border-b border-classic-border pb-1">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
