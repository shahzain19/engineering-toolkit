'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className="relative w-full">
      <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-classic-muted pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tools..."
        className="w-full pl-7 pr-7 py-1.5 bg-classic-input border border-classic-border focus:border-classic-accent rounded-sm text-classic-text text-sm placeholder:text-classic-muted focus:outline-none transition-all duration-100"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-classic-muted hover:text-classic-text transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
