'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Trash2, Sun, Moon, Monitor, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getHistory, clearHistory } from '@/utils/storage';
import type { CalculationHistory } from '@/types';

export function SettingsPage() {
  const { settings, resolvedTheme, toggleTheme } = useApp();
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
        <div className="p-3 rounded-xl bg-slate-700/80 text-slate-400"><Settings size={22} /></div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Settings</h1>
          <p className="text-sm text-slate-400">Preferences and calculation history</p>
        </div>
      </div>

      {/* Theme */}
      <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-200">Color Theme</p>
            <p className="text-xs text-slate-500">Currently: {resolvedTheme} mode</p>
          </div>
          <div className="flex gap-2">
            {[
              { icon: Sun, label: 'Light', value: 'light' },
              { icon: Moon, label: 'Dark', value: 'dark' },
            ].map((theme) => {
              const Icon = theme.icon;
              const isActive = settings.theme === theme.value;
              return (
                <button
                  key={theme.value}
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <Icon size={14} />
                  {theme.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">Usage Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
            <p className="text-2xl font-bold text-cyan-400">{history.length}</p>
            <p className="text-xs text-slate-500">Calculations saved</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
            <p className="text-2xl font-bold text-yellow-400">{settings.favorites.length}</p>
            <p className="text-xs text-slate-500">Favorites</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
            <p className="text-2xl font-bold text-blue-400">{settings.recentCalculators.length}</p>
            <p className="text-xs text-slate-500">Tools used</p>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="rounded-xl bg-slate-800/50 border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-300">Calculation History</h2>
            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">{history.length}</span>
          </div>
          <button
            onClick={handleClearHistory}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              cleared
                ? 'bg-green-500/15 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
            }`}
          >
            <Trash2 size={13} />
            {cleared ? 'Cleared!' : 'Clear All'}
          </button>
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            No calculation history yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50 max-h-96 overflow-y-auto">
            {history.map((entry) => (
              <div key={entry.id} className="px-5 py-3 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">{entry.calculatorTitle}</p>
                    <p className="text-xs text-cyan-400 font-mono mt-0.5 truncate">{entry.result}</p>
                  </div>
                  <span className="text-xs text-slate-600 flex-shrink-0">{formatTime(entry.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About */}
      <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-2">About</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Engineering Toolkit — A professional suite of calculators for electrical, mechanical, and conversion workflows.
          All calculations run client-side with no data sent to external servers.
        </p>
        <p className="text-xs text-slate-600 mt-2">v1.0.0 · Built with Next.js & TypeScript</p>
      </div>
    </div>
  );
}
