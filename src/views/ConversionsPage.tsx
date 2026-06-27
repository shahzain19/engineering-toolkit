'use client';

import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { UnitConverter } from '@/calculators/UnitConverter';

export function ConversionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><ArrowLeftRight size={22} /></div>
        <div>
          <h1 className="text-xl font-bold text-classic-text">Unit Conversions</h1>
          <p className="text-sm text-classic-muted">Length, mass, temperature, pressure, area, volume & angle</p>
        </div>
      </div>
      <div className="bg-classic-panel border border-classic-border p-6 shadow-sm">
        <UnitConverter />
      </div>
    </div>
  );
}
