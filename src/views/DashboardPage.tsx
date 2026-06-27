'use client';

import React, { useMemo } from 'react';
import { TrendingUp, Clock, Star, Search, Cpu, Zap, Cog, ArrowLeftRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { SearchBar } from '@/components/SearchBar';
import { useApp } from '@/context/AppContext';

const STAT_CARDS = [
  { label: 'Calculators', value: '8', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { label: 'Electrical', value: '4', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { label: 'Mechanical', value: '3', icon: Cog, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Converters', value: '7', icon: ArrowLeftRight, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
];

export function DashboardPage() {
  const { settings, searchQuery, setActiveCalculator, setActiveSection } = useApp();

  const filteredCalculators = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return CALCULATORS.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q))
    );
  }, [searchQuery]);

  const featuredCalculators = CALCULATORS.filter((c) => c.featured);

  const recentCalculators = useMemo(() => {
    return settings.recentCalculators
      .map((id) => CALCULATORS.find((c) => c.id === id))
      .filter(Boolean) as typeof CALCULATORS;
  }, [settings.recentCalculators]);

  const favoriteCalculators = useMemo(() => {
    return settings.favorites
      .map((id) => CALCULATORS.find((c) => c.id === id))
      .filter(Boolean) as typeof CALCULATORS;
  }, [settings.favorites]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-classic-panel border border-classic-border p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Cpu size={16} className="text-classic-accent" />
          <span className="text-xs font-semibold text-classic-muted uppercase tracking-widest">Engineering Toolkit</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-classic-text mb-2">
          Welcome back, Engineer
        </h1>
        <p className="text-classic-muted text-sm max-w-xl">
          Professional-grade calculators for electrical, mechanical, and conversion workflows. Built for engineers, makers, and students.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-3 border border-classic-border bg-classic-input shadow-sm flex items-center gap-3">
              <div className="p-1.5 rounded-sm bg-classic-bg border border-classic-border text-classic-accent">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-lg font-bold text-classic-text leading-tight">{stat.value}</p>
                <p className="text-xs text-classic-muted">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <div className="border border-classic-border bg-classic-panel p-3 shadow-sm">
          <SearchBar />
        </div>
        {searchQuery && (
          <div className="space-y-2 pt-2">
            {filteredCalculators.length === 0 ? (
              <div className="flex items-center gap-3 py-6 text-classic-muted text-sm justify-center border border-classic-border bg-classic-input shadow-sm">
                <Search size={16} />
                <span>No calculators match "{searchQuery}"</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredCalculators.map((calc) => (
                  <CalculatorCard key={calc.id} calculator={calc} compact />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Featured */}
      {!searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-classic-border pb-1">
            <TrendingUp size={14} className="text-classic-accent" />
            <h2 className="text-sm font-bold text-classic-text uppercase tracking-wider">Featured Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredCalculators.map((calc) => (
              <CalculatorCard key={calc.id} calculator={calc} />
            ))}
          </div>
        </div>
      )}

      {/* Recent */}
      {!searchQuery && recentCalculators.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-classic-border pb-1 mt-6">
            <Clock size={14} className="text-classic-accent" />
            <h2 className="text-sm font-bold text-classic-text uppercase tracking-wider">Recently Used</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentCalculators.slice(0, 4).map((calc) => (
              <CalculatorCard key={calc.id} calculator={calc} compact />
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {!searchQuery && favoriteCalculators.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-classic-border pb-1 mt-6">
            <Star size={14} className="text-classic-accent" />
            <h2 className="text-sm font-bold text-classic-text uppercase tracking-wider">Favorites</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favoriteCalculators.map((calc) => (
              <CalculatorCard key={calc.id} calculator={calc} compact />
            ))}
          </div>
        </div>
      )}

      {/* Empty state for no favorites/recents */}
      {!searchQuery && recentCalculators.length === 0 && favoriteCalculators.length === 0 && (
        <div className="border border-classic-border bg-classic-input p-8 text-center shadow-sm mt-6">
          <div className="flex justify-center mb-3">
            <Cpu size={32} className="text-classic-muted opacity-50" />
          </div>
          <p className="text-classic-text text-sm font-medium">Open a calculator to track recently used tools.</p>
          <p className="text-classic-muted text-xs mt-1">Star calculators to save them as favorites.</p>
        </div>
      )}
    </div>
  );
}
