'use client';

import React from 'react';
import { Cog, ChevronRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { GearRatioCalculator } from '@/calculators/GearRatio';
import { TorqueCalculator } from '@/calculators/TorqueCalculator';
import { BeamCalculator } from '@/calculators/BeamCalculator';
import { ThermalExpansion } from '@/calculators/ThermalExpansion';
import { FactorOfSafetyCalculator } from '@/calculators/FactorOfSafety';
import { useApp } from '@/context/AppContext';

const mechCalcs = CALCULATORS.filter((c) => c.category === 'mechanical');

const calcMap: Record<string, React.ReactNode> = {
  'gear-ratio': <GearRatioCalculator />,
  'torque-calculator': <TorqueCalculator />,
  'beam-calculator': <BeamCalculator />,
  'thermal-expansion': <ThermalExpansion />,
  'factor-of-safety': <FactorOfSafetyCalculator />,
};

export function MechanicalPage() {
  const { activeCalculator, setActiveCalculator } = useApp();
  const calc = activeCalculator && mechCalcs.find((c) => c.id === activeCalculator);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-classic-border pb-3">
        <div className="p-1.5 rounded-sm bg-classic-accent text-classic-accent-text">
          <Cog size={18} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-classic-text">Mechanical Calculators</h1>
          <p className="text-xs text-classic-muted">Gears, torque, stress analysis, and thermal calculations</p>
        </div>
      </div>

      {calc && (
        <nav className="flex items-center gap-2 text-xs bg-classic-panel border border-classic-border p-2">
          <button onClick={() => setActiveCalculator(null)} className="text-classic-muted hover:text-classic-text transition-colors font-semibold">
            Mechanical
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
          {mechCalcs.map((c) => (
            <CalculatorCard key={c.id} calculator={c} />
          ))}
        </div>
      )}
    </div>
  );
}
