'use client';

import React from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { OhmsLawCalculator } from '@/calculators/OhmsLaw';
import { VoltageDividerCalculator } from '@/calculators/VoltageDivider';
import { ResistorColorCodeCalculator } from '@/calculators/ResistorColorCode';
import { PowerCalculator } from '@/calculators/PowerCalculator';
import { useApp } from '@/context/AppContext';

const electricalCalcs = CALCULATORS.filter((c) => c.category === 'electrical');

const calcMap: Record<string, React.ReactNode> = {
  'ohms-law': <OhmsLawCalculator />,
  'voltage-divider': <VoltageDividerCalculator />,
  'resistor-color-code': <ResistorColorCodeCalculator />,
  'power-calculator': <PowerCalculator />,
};

export function ElectricalPage() {
  const { activeCalculator, setActiveCalculator } = useApp();
  const calc = activeCalculator && electricalCalcs.find((c) => c.id === activeCalculator);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-yellow-500/15 text-yellow-400">
          <Zap size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Electrical Calculators</h1>
          <p className="text-sm text-slate-400">Circuit analysis, component values, and power calculations</p>
        </div>
      </div>

      {/* Breadcrumb */}
      {calc && (
        <nav className="flex items-center gap-2 text-sm">
          <button onClick={() => setActiveCalculator(null)} className="text-slate-500 hover:text-slate-300 transition-colors">
            Electrical
          </button>
          <ChevronRight size={14} className="text-slate-600" />
          <span className="text-slate-200 font-medium">{calc.title}</span>
        </nav>
      )}

      {/* Calculator view or card grid */}
      {calc && calcMap[calc.id] ? (
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/80 p-6">
          {calcMap[calc.id]}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {electricalCalcs.map((c) => (
            <CalculatorCard key={c.id} calculator={c} />
          ))}
        </div>
      )}
    </div>
  );
}
