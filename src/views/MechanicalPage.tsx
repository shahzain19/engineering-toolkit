'use client';

import React from 'react';
import { Cog, ChevronRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { GearRatioCalculator } from '@/calculators/GearRatio';
import { TorqueCalculator } from '@/calculators/TorqueCalculator';
import { BeamCalculator } from '@/calculators/BeamCalculator';
import { useApp } from '@/context/AppContext';

const mechCalcs = CALCULATORS.filter((c) => c.category === 'mechanical');

const calcMap: Record<string, React.ReactNode> = {
  'gear-ratio': <GearRatioCalculator />,
  'torque-calculator': <TorqueCalculator />,
  'beam-calculator': <BeamCalculator />,
};

export function MechanicalPage() {
  const { activeCalculator, setActiveCalculator } = useApp();
  const calc = activeCalculator && mechCalcs.find((c) => c.id === activeCalculator);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400"><Cog size={22} /></div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Mechanical Calculators</h1>
          <p className="text-sm text-slate-400">Gears, torque, stress analysis, and structural calculations</p>
        </div>
      </div>

      {calc && (
        <nav className="flex items-center gap-2 text-sm">
          <button onClick={() => setActiveCalculator(null)} className="text-slate-500 hover:text-slate-300 transition-colors">
            Mechanical
          </button>
          <ChevronRight size={14} className="text-slate-600" />
          <span className="text-slate-200 font-medium">{calc.title}</span>
        </nav>
      )}

      {calc && calcMap[calc.id] ? (
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/80 p-6">
          {calcMap[calc.id]}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mechCalcs.map((c) => (
            <CalculatorCard key={c.id} calculator={c} />
          ))}
        </div>
      )}
    </div>
  );
}
