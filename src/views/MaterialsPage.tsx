'use client';

import React from 'react';
import { FlaskConical } from 'lucide-react';
import { BEAM_MATERIALS } from '@/data/calculators';

export function MaterialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><FlaskConical size={22} /></div>
        <div>
          <h1 className="text-xl font-bold text-classic-text">Materials Reference</h1>
          <p className="text-sm text-classic-muted">Engineering material properties reference database</p>
        </div>
      </div>

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
                <th className="text-right px-4 py-3 text-classic-muted font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Density</th>
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
                  <td className="px-4 py-3 text-right hidden sm:table-cell text-classic-muted">—</td>
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
            { name: "Gravitational Acceleration", value: '9.80665 m/s²', desc: 'Standard gravity (g)' },
            { name: "Boltzmann Constant", value: '1.38 × 10⁻²³ J/K', desc: 'Thermal energy per degree' },
            { name: "Stefan-Boltzmann Constant", value: '5.67 × 10⁻⁸ W/m²K⁴', desc: 'Blackbody radiation' },
            { name: "Speed of Light", value: '299,792,458 m/s', desc: 'Universal constant (c)' },
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
  );
}
