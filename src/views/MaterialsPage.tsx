'use client';

import React from 'react';
import { FlaskConical, ChevronRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { MaterialWeightCalculator } from '@/calculators/MaterialWeight';
import { DensityLookupTable } from '@/calculators/DensityLookup';
import { BEAM_MATERIALS } from '@/data/calculators';
import { useApp } from '@/context/AppContext';

const materialCalcs = CALCULATORS.filter((c) => c.category === 'materials');

const calcMap: Record<string, React.ReactNode> = {
  'material-weight': <MaterialWeightCalculator />,
  'density-lookup': <DensityLookupTable />,
};

export function MaterialsPage() {
  const { activeCalculator, setActiveCalculator } = useApp();
  const calc = activeCalculator && materialCalcs.find((c) => c.id === activeCalculator);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-classic-border pb-3">
        <div className="p-1.5 bg-classic-accent text-classic-accent-text">
          <FlaskConical size={18} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-classic-text">Materials</h1>
          <p className="text-xs text-classic-muted">Material properties, weight, and density reference</p>
        </div>
      </div>

      {calc && (
        <nav className="flex items-center gap-2 text-xs bg-classic-panel border border-classic-border p-2">
          <button onClick={() => setActiveCalculator(null)} className="text-classic-muted hover:text-classic-text font-semibold">
            Materials
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
        <div className="space-y-4">
          {/* Calculator cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {materialCalcs.map((c) => (
              <CalculatorCard key={c.id} calculator={c} />
            ))}
          </div>

          {/* Structural reference table */}
          <div className="bg-classic-panel border border-classic-border overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-classic-border bg-classic-bg">
              <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Structural Materials — Mechanical Properties</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-classic-border bg-classic-input">
                    <th className="text-left px-4 py-3 text-classic-muted font-semibold text-xs uppercase tracking-wider">Material</th>
                    <th className="text-right px-4 py-3 text-classic-muted font-semibold text-xs uppercase tracking-wider">Elastic Modulus</th>
                    <th className="text-right px-4 py-3 text-classic-muted font-semibold text-xs uppercase tracking-wider">Yield Strength</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-classic-border">
                  {Object.entries(BEAM_MATERIALS).map(([key, mat]) => (
                    <tr key={key} className="hover:bg-classic-input transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-classic-text">{mat.name}</div>
                        <div className="text-xs text-classic-muted capitalize">{key}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-classic-accent">{(mat.elasticModulus / 1e9).toFixed(1)} GPa</td>
                      <td className="px-4 py-3 text-right font-mono text-classic-accent">{(mat.yieldStrength / 1e6).toFixed(0)} MPa</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Engineering constants */}
          <div className="bg-classic-panel border border-classic-border overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-classic-border bg-classic-bg">
              <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Key Engineering Constants</p>
            </div>
            <div className="divide-y divide-classic-border">
              {[
                { name: "Young's Modulus (Steel)", value: '200 GPa', desc: 'Resistance to elastic deformation' },
                { name: 'Gravitational Acceleration', value: '9.80665 m/s²', desc: 'Standard gravity (g)' },
                { name: 'Boltzmann Constant', value: '1.38 × 10⁻²³ J/K', desc: 'Thermal energy per degree' },
                { name: 'Stefan-Boltzmann Constant', value: '5.67 × 10⁻⁸ W/m²K⁴', desc: 'Blackbody radiation' },
                { name: 'Speed of Light', value: '299,792,458 m/s', desc: 'Universal constant (c)' },
                { name: "Avogadro's Number", value: '6.022 × 10²³ mol⁻¹', desc: 'Mole definition' },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between px-4 py-3 hover:bg-classic-input transition-colors">
                  <div>
                    <p className="text-sm font-medium text-classic-text">{c.name}</p>
                    <p className="text-xs text-classic-muted">{c.desc}</p>
                  </div>
                  <span className="font-mono text-sm text-classic-accent ml-4 flex-shrink-0">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
