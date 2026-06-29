'use client';

import React from 'react';
import { Bot, ChevronRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { WheelRPMSpeedConverter } from '@/calculators/WheelRPMSpeed';
import { DifferentialDriveCalculator } from '@/calculators/DifferentialDrive';
import { useApp } from '@/context/AppContext';

const calcs = CALCULATORS.filter((c) => c.category === 'robotics');

const calcMap: Record<string, React.ReactNode> = {
  'wheel-rpm-speed': <WheelRPMSpeedConverter />,
  'differential-drive': <DifferentialDriveCalculator />,
};

export function RoboticsPage() {
  const { activeCalculator, setActiveCalculator } = useApp();
  const calc = activeCalculator && calcs.find((c) => c.id === activeCalculator);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-classic-border pb-3">
        <div className="p-1.5 bg-classic-accent text-classic-accent-text"><Bot size={18} /></div>
        <div>
          <h1 className="text-lg font-bold text-classic-text">Robotics</h1>
          <p className="text-xs text-classic-muted">Wheel speed, drive kinematics, and motion calculations</p>
        </div>
      </div>
      {calc && (
        <nav className="flex items-center gap-2 text-xs bg-classic-panel border border-classic-border p-2">
          <button onClick={() => setActiveCalculator(null)} className="text-classic-muted hover:text-classic-text font-semibold">Robotics</button>
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
