'use client';

import React from 'react';
import { Rocket, ChevronRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { RocketEquationCalculator } from '@/calculators/RocketEquation';
import { MachNumberCalculator } from '@/calculators/MachNumber';
import { useApp } from '@/context/AppContext';

const calcs = CALCULATORS.filter((c) => c.category === 'aerospace');

const calcMap: Record<string, React.ReactNode> = {
  'rocket-equation': <RocketEquationCalculator />,
  'mach-number': <MachNumberCalculator />,
};

export function AerospacePage() {
  const { activeCalculator, setActiveCalculator } = useApp();
  const calc = activeCalculator && calcs.find((c) => c.id === activeCalculator);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-classic-border pb-3">
        <div className="p-1.5 bg-classic-accent text-classic-accent-text"><Rocket size={18} /></div>
        <div>
          <h1 className="text-lg font-bold text-classic-text">Aerospace</h1>
          <p className="text-xs text-classic-muted">Rocket propulsion, flight dynamics, and atmospheric calculations</p>
        </div>
      </div>
      {calc && (
        <nav className="flex items-center gap-2 text-xs bg-classic-panel border border-classic-border p-2">
          <button onClick={() => setActiveCalculator(null)} className="text-classic-muted hover:text-classic-text font-semibold">Aerospace</button>
          <ChevronRight size={14} className="text-classic-muted" />
          <span className="text-classic-text font-bold">{calc.title}</span>
        </nav>
      )}
      {calc && calcMap[calc.id] ? (
        <div className="bg-classic-panel border border-classic-border p-4 shadow-sm">{calcMap[calc.id]}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {calcs.map((c) => <CalculatorCard key={c.id} calculator={c} />)}
        </div>
      )}
    </div>
  );
}
