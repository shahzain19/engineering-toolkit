'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      className="btn-classic flex items-center gap-2"
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      <span className="hidden sm:block">
        {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
