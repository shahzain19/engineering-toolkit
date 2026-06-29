'use client';

import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';

interface ThreadEntry { size: string; pitch: number; tapDrill_mm: number; tapDrill_frac?: string; clearance_mm: number; }

const METRIC_THREADS: ThreadEntry[] = [
  { size: 'M1.6', pitch: 0.35, tapDrill_mm: 1.25, clearance_mm: 1.7 },
  { size: 'M2', pitch: 0.40, tapDrill_mm: 1.6, clearance_mm: 2.2 },
  { size: 'M2.5', pitch: 0.45, tapDrill_mm: 2.05, clearance_mm: 2.7 },
  { size: 'M3', pitch: 0.50, tapDrill_mm: 2.5, clearance_mm: 3.2 },
  { size: 'M4', pitch: 0.70, tapDrill_mm: 3.3, clearance_mm: 4.3 },
  { size: 'M5', pitch: 0.80, tapDrill_mm: 4.2, clearance_mm: 5.3 },
  { size: 'M6', pitch: 1.00, tapDrill_mm: 5.0, clearance_mm: 6.4 },
  { size: 'M8', pitch: 1.25, tapDrill_mm: 6.7, clearance_mm: 8.4 },
  { size: 'M10', pitch: 1.50, tapDrill_mm: 8.5, clearance_mm: 10.5 },
  { size: 'M12', pitch: 1.75, tapDrill_mm: 10.2, clearance_mm: 12.5 },
  { size: 'M14', pitch: 2.00, tapDrill_mm: 12.0, clearance_mm: 14.5 },
  { size: 'M16', pitch: 2.00, tapDrill_mm: 14.0, clearance_mm: 16.5 },
  { size: 'M20', pitch: 2.50, tapDrill_mm: 17.5, clearance_mm: 21.0 },
  { size: 'M24', pitch: 3.00, tapDrill_mm: 21.0, clearance_mm: 25.0 },
];

const UNC_THREADS: ThreadEntry[] = [
  { size: '#4-40', pitch: 1/40, tapDrill_mm: 2.845, tapDrill_frac: '#43', clearance_mm: 3.2 },
  { size: '#6-32', pitch: 1/32, tapDrill_mm: 3.454, tapDrill_frac: '#36', clearance_mm: 3.7 },
  { size: '#8-32', pitch: 1/32, tapDrill_mm: 3.962, tapDrill_frac: '#29', clearance_mm: 4.3 },
  { size: '#10-24', pitch: 1/24, tapDrill_mm: 4.166, tapDrill_frac: '#25', clearance_mm: 4.8 },
  { size: '1/4"-20', pitch: 1/20, tapDrill_mm: 5.105, tapDrill_frac: '#7', clearance_mm: 6.7 },
  { size: '5/16"-18', pitch: 1/18, tapDrill_mm: 6.756, tapDrill_frac: 'F', clearance_mm: 8.7 },
  { size: '3/8"-16', pitch: 1/16, tapDrill_mm: 8.204, tapDrill_frac: '5/16"', clearance_mm: 10.3 },
  { size: '7/16"-14', pitch: 1/14, tapDrill_mm: 9.652, tapDrill_frac: 'U', clearance_mm: 11.9 },
  { size: '1/2"-13', pitch: 1/13, tapDrill_mm: 10.922, tapDrill_frac: '27/64"', clearance_mm: 13.5 },
  { size: '5/8"-11', pitch: 1/11, tapDrill_mm: 13.716, tapDrill_frac: '17/32"', clearance_mm: 17.5 },
  { size: '3/4"-10', pitch: 1/10, tapDrill_mm: 16.669, tapDrill_frac: '21/32"', clearance_mm: 20.6 },
  { size: '1"-8', pitch: 1/8, tapDrill_mm: 22.225, tapDrill_frac: '7/8"', clearance_mm: 27.0 },
];

type Standard = 'metric' | 'unc';

export function TapDrillSizeCalculator() {
  const [standard, setStandard] = useState<Standard>('metric');
  const [selected, setSelected] = useState('0');

  const threads = standard === 'metric' ? METRIC_THREADS : UNC_THREADS;
  const thread = threads[parseInt(selected)];

  const threadOptions = threads.map((t, i) => ({ value: String(i), label: t.size }));

  const minor_dia = standard === 'metric'
    ? (parseFloat(thread.size.replace('M', '')) - thread.pitch).toFixed(3)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Wrench size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Tap Drill Size Calculator</h2>
          <p className="text-sm text-classic-muted">Find correct tap drill for threaded holes</p>
        </div>
      </div>

      <div className="bg-classic-bg border border-classic-border p-3 text-xs text-classic-muted">
        <strong className="text-classic-text">Formula (Metric):</strong> Tap Drill ≈ Major Diameter − Pitch
        <br />
        <strong className="text-classic-text">UNC/UNF:</strong> Values from ASME B1.1 standard tables.
      </div>

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Thread Standard</p>
        <div className="grid grid-cols-2 gap-2">
          {(['metric', 'unc'] as Standard[]).map((s) => (
            <button
              key={s}
              onClick={() => { setStandard(s); setSelected('0'); }}
              className={`py-2 px-3 text-sm font-medium border transition-colors ${
                standard === s ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'
              }`}
            >
              {s === 'metric' ? 'Metric (ISO)' : 'UNC (Imperial)'}
            </button>
          ))}
        </div>
      </div>

      <SelectInput label="Thread Size" value={selected} onChange={setSelected} options={threadOptions} />

      <div className="grid grid-cols-2 gap-3">
        <ResultBox label="Tap Drill Size" value={`${thread.tapDrill_mm} mm`} highlight />
        {thread.tapDrill_frac && <ResultBox label="Fractional / Letter Drill" value={thread.tapDrill_frac} />}
        <ResultBox label="Clearance Drill" value={`${thread.clearance_mm} mm`} />
        <ResultBox label="Thread Pitch" value={standard === 'metric' ? `${thread.pitch} mm` : `${(1/thread.pitch).toFixed(0)} TPI`} />
        {minor_dia && <ResultBox label="Minor Diameter (approx)" value={`${minor_dia} mm`} />}
      </div>

      {/* Full table */}
      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">
            {standard === 'metric' ? 'Metric ISO Thread Reference' : 'UNC Thread Reference'}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-classic-border bg-classic-input">
                <th className="text-left px-3 py-2 text-classic-muted font-semibold">Size</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">{standard === 'metric' ? 'Pitch (mm)' : 'TPI'}</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">Tap Drill</th>
                <th className="text-right px-3 py-2 text-classic-muted font-semibold">Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-classic-border">
              {threads.map((t, i) => (
                <tr
                  key={t.size}
                  className={`hover:bg-classic-input transition-colors cursor-pointer ${parseInt(selected) === i ? 'bg-classic-input font-bold' : ''}`}
                  onClick={() => setSelected(String(i))}
                >
                  <td className="px-3 py-2 font-mono text-classic-accent">{t.size}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-muted">
                    {standard === 'metric' ? t.pitch : (1/t.pitch).toFixed(0)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-classic-text">{t.tapDrill_mm} mm{t.tapDrill_frac ? ` (${t.tapDrill_frac})` : ''}</td>
                  <td className="px-3 py-2 text-right font-mono text-classic-muted">{t.clearance_mm} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
