'use client';

import React, { useState, useMemo } from 'react';
import { Signal } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { addHistory } from '@/utils/storage';

type ActiveField = 'dbm' | 'mw' | 'w';

export function DBmWattConverter() {
  const [dbm, setDbm] = useState('');
  const [mw, setMw] = useState('');
  const [w, setW] = useState('');
  const [active, setActive] = useState<ActiveField>('dbm');

  const derived = useMemo(() => {
    if (active === 'dbm') {
      const d = parseFloat(dbm);
      if (isNaN(d)) return null;
      const mwVal = Math.pow(10, d / 10);
      return { dbm: d, mw: mwVal, w: mwVal / 1000 };
    } else if (active === 'mw') {
      const m = parseFloat(mw);
      if (isNaN(m) || m <= 0) return null;
      const dVal = 10 * Math.log10(m);
      return { dbm: dVal, mw: m, w: m / 1000 };
    } else {
      const wVal = parseFloat(w);
      if (isNaN(wVal) || wVal <= 0) return null;
      const dVal = 10 * Math.log10(wVal * 1000);
      return { dbm: dVal, mw: wVal * 1000, w: wVal };
    }
  }, [dbm, mw, w, active]);

  const handleChange = (field: ActiveField, val: string) => {
    setActive(field);
    if (field === 'dbm') setDbm(val);
    if (field === 'mw') setMw(val);
    if (field === 'w') setW(val);
  };

  const handleSave = () => {
    if (!derived) return;
    addHistory({
      calculatorId: 'dbm-watt-converter',
      calculatorTitle: 'dBm ↔ Watt Converter',
      inputs: { [active]: active === 'dbm' ? dbm : active === 'mw' ? mw : w },
      result: `${derived.dbm.toFixed(2)} dBm = ${derived.mw.toPrecision(5)} mW`,
    });
  };

  const fmtNum = (n: number) => {
    if (!isFinite(n)) return 'Invalid';
    if (Math.abs(n) >= 1e6 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(4);
    return parseFloat(n.toPrecision(6)).toString();
  };

  const COMMON = [
    { dbm: -30, label: '–30 dBm = 1 µW (noise floor)' },
    { dbm: -20, label: '–20 dBm = 10 µW' },
    { dbm: -10, label: '–10 dBm = 100 µW' },
    { dbm: 0, label: '0 dBm = 1 mW' },
    { dbm: 10, label: '+10 dBm = 10 mW' },
    { dbm: 20, label: '+20 dBm = 100 mW' },
    { dbm: 23, label: '+23 dBm = 200 mW (typical Wi-Fi)' },
    { dbm: 30, label: '+30 dBm = 1 W' },
    { dbm: 37, label: '+37 dBm = 5 W (CB radio)' },
    { dbm: 40, label: '+40 dBm = 10 W' },
    { dbm: 43, label: '+43 dBm = 20 W' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Signal size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">dBm ↔ Watt Converter</h2>
          <p className="text-sm text-classic-muted">RF power unit conversion in real-time</p>
        </div>
      </div>

      <FormulaDisplay
        formula="P(dBm) = 10 × log₁₀(P(mW))"
        description="Power in decibels relative to 1 milliwatt"
        variables={[
          { symbol: 'dBm', description: 'Power (dB re 1 mW)' },
          { symbol: 'mW', description: 'Power in milliwatts' },
          { symbol: 'W', description: 'Power in watts' },
        ]}
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-classic-text uppercase tracking-wider">dBm</label>
          <input type="number" value={active === 'dbm' ? dbm : (derived ? derived.dbm.toFixed(4) : '')}
            onChange={(e) => handleChange('dbm', e.target.value)}
            placeholder="e.g. 0"
            className={`px-3 py-1.5 border text-classic-text text-sm font-mono focus:outline-none focus:border-classic-accent transition-colors ${active === 'dbm' ? 'bg-[#ffffcc] border-classic-accent' : 'bg-classic-input border-classic-border'}`} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-classic-text uppercase tracking-wider">Milliwatts (mW)</label>
          <input type="number" value={active === 'mw' ? mw : (derived && derived.mw > 0 ? fmtNum(derived.mw) : '')}
            onChange={(e) => handleChange('mw', e.target.value)}
            placeholder="e.g. 1"
            className={`px-3 py-1.5 border text-classic-text text-sm font-mono focus:outline-none focus:border-classic-accent transition-colors ${active === 'mw' ? 'bg-[#ffffcc] border-classic-accent' : 'bg-classic-input border-classic-border'}`} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-classic-text uppercase tracking-wider">Watts (W)</label>
          <input type="number" value={active === 'w' ? w : (derived && derived.w > 0 ? fmtNum(derived.w) : '')}
            onChange={(e) => handleChange('w', e.target.value)}
            placeholder="e.g. 0.001"
            className={`px-3 py-1.5 border text-classic-text text-sm font-mono focus:outline-none focus:border-classic-accent transition-colors ${active === 'w' ? 'bg-[#ffffcc] border-classic-accent' : 'bg-classic-input border-classic-border'}`} />
        </div>
      </div>

      {derived && (
        <div className="grid grid-cols-3 gap-3">
          <ResultBox label="dBm" value={derived.dbm.toFixed(4)} />
          <ResultBox label="mW" value={fmtNum(derived.mw)} unit="mW" highlight />
          <ResultBox label="Watts" value={fmtNum(derived.w)} unit="W" />
        </div>
      )}

      <button onClick={handleSave} disabled={!derived} className="w-full py-2.5 px-6 bg-classic-accent text-classic-accent-text font-bold text-sm hover:bg-classic-accent-hover transition-colors border border-classic-border disabled:opacity-40">
        Save to History
      </button>

      {/* Common values table */}
      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Common RF Power Levels</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-classic-border bg-classic-input">
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">dBm</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">mW</th>
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-classic-border">
              {COMMON.map(({ dbm: d, label }) => {
                const mwV = Math.pow(10, d / 10);
                return (
                  <tr key={d} className="hover:bg-classic-input transition-colors cursor-pointer"
                      onClick={() => { setActive('dbm'); setDbm(String(d)); }}>
                    <td className="px-3 py-2 text-right font-mono text-classic-accent">{d}</td>
                    <td className="px-3 py-2 text-right font-mono text-classic-text">{fmtNum(mwV)}</td>
                    <td className="px-3 py-2 text-classic-muted">{label.split('=')[1]?.trim()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
