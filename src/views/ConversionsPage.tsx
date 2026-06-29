'use client';

import React from 'react';
import { ArrowLeftRight, ChevronRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { UnitConverter } from '@/calculators/UnitConverter';
import { EngineeringPrefixConverter } from '@/calculators/EngineeringPrefix';
import { useApp } from '@/context/AppContext';

const conversionCalcs = CALCULATORS.filter((c) => c.category === 'conversions');

const calcMap: Record<string, React.ReactNode> = {
  'unit-converter': <UnitConverter />,
  'engineering-prefix': <EngineeringPrefixConverter />,
};

export function ConversionsPage() {
  const { activeCalculator, setActiveCalculator } = useApp();
  const calc = activeCalculator && conversionCalcs.find((c) => c.id === activeCalculator);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-classic-border pb-3">
        <div className="p-1.5 bg-classic-accent text-classic-accent-text">
          <ArrowLeftRight size={18} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-classic-text">Unit Conversions</h1>
          <p className="text-xs text-classic-muted">Length, mass, temperature, pressure, SI prefixes and more</p>
        </div>
      </div>

      {calc && (
        <nav className="flex items-center gap-2 text-xs bg-classic-panel border border-classic-border p-2">
          <button onClick={() => setActiveCalculator(null)} className="text-classic-muted hover:text-classic-text font-semibold">
            Conversions
          </button>
          <ChevronRight size={14} className="text-classic-muted" />
          <span className="text-classic-text font-bold">{calc.title}</span>
        </nav>
      )}

      {calc && calcMap[calc.id] ? (
        <div className="bg-classic-panel border border-classic-border p-4 shadow-sm">
          {calcMap[calc.id]}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {conversionCalcs.map((c) => (
            <CalculatorCard key={c.id} calculator={c} />
          ))}
        </div>
      )}
    </div>
  );
}
