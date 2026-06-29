'use client';

import React, { useState } from 'react';
import { Search, Table } from 'lucide-react';

const MATERIALS = [
  { category: 'Metals', name: 'Aluminum (pure)', density: 2700 },
  { category: 'Metals', name: 'Aluminum 6061', density: 2700 },
  { category: 'Metals', name: 'Brass', density: 8500 },
  { category: 'Metals', name: 'Bronze', density: 8800 },
  { category: 'Metals', name: 'Cast Iron', density: 7200 },
  { category: 'Metals', name: 'Chromium', density: 7190 },
  { category: 'Metals', name: 'Copper', density: 8960 },
  { category: 'Metals', name: 'Gold', density: 19320 },
  { category: 'Metals', name: 'Inconel 625', density: 8440 },
  { category: 'Metals', name: 'Lead', density: 11340 },
  { category: 'Metals', name: 'Magnesium', density: 1740 },
  { category: 'Metals', name: 'Nickel', density: 8908 },
  { category: 'Metals', name: 'Silver', density: 10490 },
  { category: 'Metals', name: 'Stainless Steel 304', density: 8000 },
  { category: 'Metals', name: 'Stainless Steel 316', density: 8030 },
  { category: 'Metals', name: 'Structural Steel', density: 7850 },
  { category: 'Metals', name: 'Titanium (Ti-6Al-4V)', density: 4430 },
  { category: 'Metals', name: 'Tungsten', density: 19300 },
  { category: 'Metals', name: 'Zinc', density: 7133 },
  { category: 'Plastics', name: 'ABS', density: 1050 },
  { category: 'Plastics', name: 'HDPE', density: 950 },
  { category: 'Plastics', name: 'LDPE', density: 920 },
  { category: 'Plastics', name: 'Nylon (PA6)', density: 1140 },
  { category: 'Plastics', name: 'Nylon (PA66)', density: 1150 },
  { category: 'Plastics', name: 'PEEK', density: 1320 },
  { category: 'Plastics', name: 'PET', density: 1380 },
  { category: 'Plastics', name: 'PLA', density: 1240 },
  { category: 'Plastics', name: 'Polycarbonate (PC)', density: 1200 },
  { category: 'Plastics', name: 'Polypropylene (PP)', density: 905 },
  { category: 'Plastics', name: 'PVC (rigid)', density: 1400 },
  { category: 'Plastics', name: 'PTFE (Teflon)', density: 2200 },
  { category: 'Construction', name: 'Brick (common)', density: 1920 },
  { category: 'Construction', name: 'Concrete (reinforced)', density: 2400 },
  { category: 'Construction', name: 'Glass (plate)', density: 2500 },
  { category: 'Construction', name: 'Granite', density: 2700 },
  { category: 'Construction', name: 'Marble', density: 2700 },
  { category: 'Construction', name: 'Sand (dry)', density: 1600 },
  { category: 'Wood', name: 'Balsa', density: 160 },
  { category: 'Wood', name: 'Douglas Fir', density: 550 },
  { category: 'Wood', name: 'Mahogany', density: 700 },
  { category: 'Wood', name: 'Oak', density: 770 },
  { category: 'Wood', name: 'Pine', density: 550 },
  { category: 'Wood', name: 'Teak', density: 850 },
  { category: 'Fluids', name: 'Air (20°C)', density: 1.2 },
  { category: 'Fluids', name: 'Ethanol', density: 789 },
  { category: 'Fluids', name: 'Gasoline', density: 740 },
  { category: 'Fluids', name: 'Mercury', density: 13534 },
  { category: 'Fluids', name: 'Motor Oil (SAE 30)', density: 875 },
  { category: 'Fluids', name: 'Seawater', density: 1025 },
  { category: 'Fluids', name: 'Water (4°C)', density: 1000 },
];

const CATEGORIES = ['All', ...Array.from(new Set(MATERIALS.map(m => m.category)))];

export function DensityLookupTable() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = MATERIALS.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || m.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Table size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">Density Lookup Table</h2>
          <p className="text-sm text-classic-muted">Engineering material densities at standard conditions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-classic-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search material..."
            className="w-full pl-7 pr-3 py-1.5 bg-classic-input border border-classic-border text-classic-text text-sm focus:outline-none focus:border-classic-accent"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 text-xs font-medium border transition-colors ${categoryFilter === cat ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-classic-border bg-classic-panel overflow-hidden">
        <div className="px-4 py-2 border-b border-classic-border bg-classic-bg flex justify-between items-center">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Material Density Reference</p>
          <span className="text-xs text-classic-muted">{filtered.length} materials</span>
        </div>
        <div className="overflow-y-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="sticky top-0">
              <tr className="border-b border-classic-border bg-classic-input">
                <th className="text-left px-4 py-2 text-classic-muted font-semibold text-xs uppercase">Material</th>
                <th className="text-left px-4 py-2 text-classic-muted font-semibold text-xs uppercase">Category</th>
                <th className="text-right px-4 py-2 text-classic-muted font-semibold text-xs uppercase">kg/m³</th>
                <th className="text-right px-4 py-2 text-classic-muted font-semibold text-xs uppercase">g/cm³</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-classic-border">
              {filtered.map((m) => (
                <tr key={m.name} className="hover:bg-classic-input transition-colors">
                  <td className="px-4 py-2 font-medium text-classic-text">{m.name}</td>
                  <td className="px-4 py-2 text-classic-muted text-xs">{m.category}</td>
                  <td className="px-4 py-2 text-right font-mono text-classic-accent">{m.density.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-mono text-classic-muted">{(m.density / 1000).toFixed(3)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-classic-muted text-sm">No materials match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
