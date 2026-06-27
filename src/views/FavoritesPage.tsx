'use client';

import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorCard } from '@/components/CalculatorCard';
import { useApp } from '@/context/AppContext';

export function FavoritesPage() {
  const { settings } = useApp();

  const favoriteCalculators = useMemo(() => {
    return settings.favorites
      .map((id) => CALCULATORS.find((c) => c.id === id))
      .filter(Boolean) as typeof CALCULATORS;
  }, [settings.favorites]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Star size={22} /></div>
        <div>
          <h1 className="text-xl font-bold text-classic-text">Favorites</h1>
          <p className="text-sm text-classic-muted">Your saved calculators for quick access</p>
        </div>
      </div>

      {favoriteCalculators.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Star size={48} className="text-classic-muted mb-4" />
          <p className="text-classic-muted font-medium">No favorites yet</p>
          <p className="text-classic-muted text-sm mt-1">Click the ★ icon on any calculator card to add it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoriteCalculators.map((calc) => (
            <CalculatorCard key={calc.id} calculator={calc} />
          ))}
        </div>
      )}
    </div>
  );
}
