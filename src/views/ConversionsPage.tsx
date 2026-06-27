'use client';

import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { UnitConverter } from '@/calculators/UnitConverter';

export function ConversionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-green-500/15 text-green-400"><ArrowLeftRight size={22} /></div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Unit Conversions</h1>
          <p className="text-sm text-slate-400">Length, mass, temperature, pressure, area, volume & angle</p>
        </div>
      </div>
      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/80 p-6">
        <UnitConverter />
      </div>
    </div>
  );
}
