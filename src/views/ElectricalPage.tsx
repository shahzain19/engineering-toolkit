'use client';

import React from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { OhmsLawCalculator } from '@/calculators/OhmsLaw';
import { VoltageDividerCalculator } from '@/calculators/VoltageDivider';
import { ResistorColorCodeCalculator } from '@/calculators/ResistorColorCode';
import { PowerCalculator } from '@/calculators/PowerCalculator';
import { ParallelResistors } from '@/calculators/ParallelResistors';
import { LEDResistorCalculator } from '@/calculators/LEDResistor';
import { VoltageDropCalculator } from '@/calculators/VoltageDrop';
import { useApp } from '@/context/AppContext';

const electricalCalcs = CALCULATORS.filter((c) => c.category === 'electrical');

const calcMap: Record<string, React.ReactNode> = {
  'ohms-law': <OhmsLawCalculator />,
  'voltage-divider': <VoltageDividerCalculator />,
  'resistor-color-code': <ResistorColorCodeCalculator />,
  'power-calculator': <PowerCalculator />,
  'parallel-resistors': <ParallelResistors />,
  'led-resistor': <LEDResistorCalculator />,
  'voltage-drop': <VoltageDropCalculator />,
};

export function ElectricalPage() {
  const { activeCalculator, setActiveCalculator } = useApp();
  const calc = activeCalculator && electricalCalcs.find((c) => c.id === activeCalculator);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-classic-border pb-3">
        <div className="p-1.5 rounded-sm bg-classic-accent text-classic-accent-text">
          <Zap size={18} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-classic-text">Electrical Calculators</h1>
          <p className="text-xs text-classic-muted">Circuit analysis, component values, and power calculations</p>
        </div>
      </div>

      {/* Breadcrumb */}
      {calc && (
        <nav className="flex items-center gap-2 text-xs bg-classic-panel border border-classic-border p-2">
          <button onClick={() => setActiveCalculator(null)} className="text-classic-muted hover:text-classic-text transition-colors font-semibold">
            Electrical
          </button>
          <ChevronRight size={14} className="text-classic-muted" />
          <span className="text-classic-text font-bold">{calc.title}</span>
        </nav>
      )}

      {/* Calculator view or card grid */}
      {calc && calcMap[calc.id] ? (
        <div className="bg-classic-panel border border-classic-border p-4 shadow-sm">
          {calcMap[calc.id]}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {electricalCalcs.map((c) => (
            <CalculatorCard key={c.id} calculator={c} />
          ))}
        </div>
      )}
    </div>
  );
}
