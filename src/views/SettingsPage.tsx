'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Trash2, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getHistory, clearHistory } from '@/utils/storage';
import type { CalculationHistory } from '@/types';

export function SettingsPage() {
  const { settings } = useApp();
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-panel border border-classic-border"><Settings size={22} /></div>
        <div>
          <h1 className="text-xl font-bold text-classic-text">Settings</h1>
          <p className="text-sm text-classic-muted">Preferences and calculation history</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-classic-panel border border-classic-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-classic-text">Usage Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-classic-bg border border-classic-border p-3">
            <p className="text-2xl font-bold text-classic-text">{history.length}</p>
            <p className="text-xs text-classic-muted">Calculations saved</p>
          </div>
          <div className="bg-classic-bg border border-classic-border p-3">
            <p className="text-2xl font-bold text-classic-text">{settings.favorites.length}</p>
            <p className="text-xs text-classic-muted">Favorites</p>
          </div>
          <div className="bg-classic-bg border border-classic-border p-3">
            <p className="text-2xl font-bold text-classic-text">{settings.recentCalculators.length}</p>
            <p className="text-xs text-classic-muted">Tools used</p>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-classic-panel border border-classic-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-classic-border">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-classic-muted" />
            <h2 className="text-sm font-semibold text-classic-text">Calculation History</h2>
            <span className="text-xs bg-classic-bg border border-classic-border text-classic-muted px-2 py-0.5">{history.length}</span>
          </div>
          <button
            onClick={handleClearHistory}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-all ${
              cleared
                ? 'bg-classic-accent text-classic-accent-text'
                : 'btn-classic hover:border-classic-accent'
            }`}
          >
            <Trash2 size={13} />
            {cleared ? 'Cleared!' : 'Clear All'}
          </button>
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center text-classic-muted text-sm">
            No calculation history yet.
          </div>
        ) : (
          <div className="divide-y divide-classic-border max-h-96 overflow-y-auto">
            {history.map((entry) => (
              <div key={entry.id} className="px-5 py-3 hover:bg-classic-bg transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-classic-text">{entry.calculatorTitle}</p>
                    <p className="text-xs text-classic-accent font-mono mt-0.5 truncate">{entry.result}</p>
                  </div>
                  <span className="text-xs text-classic-muted flex-shrink-0">{formatTime(entry.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About */}
      <div className="bg-classic-panel border border-classic-border p-5">
        <h2 className="text-sm font-semibold text-classic-text mb-2">About</h2>
        <p className="text-xs text-classic-muted leading-relaxed">
          Engineering Toolkit — A professional suite of calculators for electrical, mechanical, and conversion workflows.
          All calculations run client-side with no data sent to external servers.
        </p>
        <p className="text-xs text-classic-muted mt-2">v1.0.0 · Built with Next.js & TypeScript</p>
      </div>
    </div>
  );
}
