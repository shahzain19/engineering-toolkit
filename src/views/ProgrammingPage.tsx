'use client';

import React from 'react';
import { Code2, ChevronRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { CRCChecksumCalculator } from '@/calculators/CRCChecksum';
import { UUIDGenerator } from '@/calculators/UUIDGenerator';
import { useApp } from '@/context/AppContext';

const calcs = CALCULATORS.filter((c) => c.category === 'programming');

const calcMap: Record<string, React.ReactNode> = {
  'crc-checksum': <CRCChecksumCalculator />,
  'uuid-generator': <UUIDGenerator />,
};

export function ProgrammingPage() {
  const { activeCalculator, setActiveCalculator } = useApp();
  const calc = activeCalculator && calcs.find((c) => c.id === activeCalculator);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-classic-border pb-3">
        <div className="p-1.5 bg-classic-accent text-classic-accent-text"><Code2 size={18} /></div>
        <div>
          <h1 className="text-lg font-bold text-classic-text">Programming</h1>
          <p className="text-xs text-classic-muted">Checksums, identifiers, and developer utilities</p>
        </div>
      </div>
      {calc && (
        <nav className="flex items-center gap-2 text-xs bg-classic-panel border border-classic-border p-2">
          <button onClick={() => setActiveCalculator(null)} className="text-classic-muted hover:text-classic-text font-semibold">Programming</button>
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
