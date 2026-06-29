'use client';

import React, { useState } from 'react';
import { Cable, Search } from 'lucide-react';

const AWG_DATA = [
  { awg: 0, dia_mm: 8.252, dia_in: 0.3249, area_mm2: 53.49, resistance: 0.1608, current_a: 245, current_b: 195 },
  { awg: 1, dia_mm: 7.348, dia_in: 0.2893, area_mm2: 42.41, resistance: 0.2028, current_a: 205, current_b: 155 },
  { awg: 2, dia_mm: 6.544, dia_in: 0.2576, area_mm2: 33.63, resistance: 0.2557, current_a: 175, current_b: 130 },
  { awg: 4, dia_mm: 5.189, dia_in: 0.2043, area_mm2: 21.15, resistance: 0.4066, current_a: 130, current_b: 100 },
  { awg: 6, dia_mm: 4.115, dia_in: 0.1620, area_mm2: 13.30, resistance: 0.6463, current_a: 100, current_b: 75 },
  { awg: 8, dia_mm: 3.264, dia_in: 0.1285, area_mm2: 8.367, resistance: 1.028, current_a: 73, current_b: 55 },
  { awg: 10, dia_mm: 2.588, dia_in: 0.1019, area_mm2: 5.261, resistance: 1.634, current_a: 55, current_b: 40 },
  { awg: 12, dia_mm: 2.053, dia_in: 0.0808, area_mm2: 3.309, resistance: 2.593, current_a: 41, current_b: 30 },
  { awg: 14, dia_mm: 1.628, dia_in: 0.0641, area_mm2: 2.081, resistance: 4.132, current_a: 32, current_b: 25 },
  { awg: 16, dia_mm: 1.291, dia_in: 0.0508, area_mm2: 1.309, resistance: 6.561, current_a: 22, current_b: 18 },
  { awg: 18, dia_mm: 1.024, dia_in: 0.0403, area_mm2: 0.8231, resistance: 10.45, current_a: 16, current_b: 14 },
  { awg: 20, dia_mm: 0.8118, dia_in: 0.0320, area_mm2: 0.5176, resistance: 16.61, current_a: 11, current_b: 11 },
  { awg: 22, dia_mm: 0.6438, dia_in: 0.0253, area_mm2: 0.3255, resistance: 26.46, current_a: 7, current_b: 7 },
  { awg: 24, dia_mm: 0.5106, dia_in: 0.0201, area_mm2: 0.2047, resistance: 42.00, current_a: 3.5, current_b: 3.5 },
  { awg: 26, dia_mm: 0.4049, dia_in: 0.0159, area_mm2: 0.1288, resistance: 66.79, current_a: 2.2, current_b: 2.2 },
  { awg: 28, dia_mm: 0.3211, dia_in: 0.0126, area_mm2: 0.0810, resistance: 106.2, current_a: 0.83, current_b: 0.83 },
  { awg: 30, dia_mm: 0.2546, dia_in: 0.0100, area_mm2: 0.05093, resistance: 168.9, current_a: 0.52, current_b: 0.52 },
];

export function AWGWireTable() {
  const [search, setSearch] = useState('');
  const [currentType, setCurrentType] = useState<'a' | 'b'>('b');

  const filtered = AWG_DATA.filter(r => String(r.awg).includes(search));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Cable size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">AWG Wire Table</h2>
          <p className="text-sm text-classic-muted">American Wire Gauge — diameter, resistance, and current capacity</p>
        </div>
      </div>

      <div className="bg-classic-bg border border-classic-border p-3 text-xs text-classic-muted">
        Resistance: Ω/km for annealed copper at 20°C. Current ratings: (A) chassis/free air, (B) in conduit/bundled. Based on NEC/ampacity tables.
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-36">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-classic-muted pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by AWG..."
            className="w-full pl-7 pr-3 py-1.5 bg-classic-input border border-classic-border text-classic-text text-sm focus:outline-none focus:border-classic-accent" />
        </div>
        <div className="flex gap-2">
          <span className="text-xs text-classic-muted self-center">Current rating:</span>
          {(['a', 'b'] as const).map(t => (
            <button key={t} onClick={() => setCurrentType(t)}
              className={`px-2.5 py-1 text-xs font-medium border transition-colors ${currentType === t ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
              {t === 'a' ? 'Free Air' : 'In Conduit'}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-classic-border bg-classic-input">
                <th className="text-left px-3 py-2 text-classic-muted font-semibold text-xs uppercase">AWG</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold text-xs uppercase">Dia (mm)</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold text-xs uppercase">Dia (in)</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold text-xs uppercase">Area (mm²)</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold text-xs uppercase">Ω/km</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold text-xs uppercase">Max A</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-classic-border">
              {filtered.map((r) => (
                <tr key={r.awg} className="hover:bg-classic-input transition-colors">
                  <td className="px-3 py-2 font-mono font-bold text-classic-accent">AWG {r.awg}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-text">{r.dia_mm}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-muted">{r.dia_in}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-muted">{r.area_mm2}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-text">{r.resistance}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-accent font-bold">
                    {currentType === 'a' ? r.current_a : r.current_b} A
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
