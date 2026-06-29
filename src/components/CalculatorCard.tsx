// CalculatorCard — renders a calculator entry as either a full card or compact row.
// iconMap must include every icon string used in src/data/calculators.ts.
// sectionMap routes each category to its SidebarSection so clicking a card
// both opens the calculator and navigates to the correct page.
'use client';

import React from 'react';
import {
  Zap, SplitSquareVertical, Palette, Battery,
  Settings, RotateCcw, Ruler, ArrowLeftRight,
  Star, TrendingUp, Lightbulb, TrendingDown, ShieldCheck,
  Gauge, GitFork, Drill, Wrench, Activity, Binary,
  Grid3x3, FunctionSquare, Weight, Table, Rocket, Wind,
  Building, Layers, Radio, Signal, Hash, Fingerprint,
  Cable, BookOpen, Circle, Pentagon, Bot, Factory,
  Cpu, Code2, Pencil, Atom, Building2,
} from 'lucide-react';
import type { Calculator } from '@/types';
import { useApp } from '@/context/AppContext';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Zap, SplitSquareVertical, Palette, Battery,
  Settings, RotateCcw, Ruler, ArrowLeftRight,
  Star, TrendingUp, Lightbulb, TrendingDown, ShieldCheck,
  Gauge, GitFork, Drill, Wrench, Activity, Binary,
  Grid3x3, FunctionSquare, Weight, Table, Rocket, Wind,
  Building, Layers, Radio, Signal, Hash, Fingerprint,
  Cable, BookOpen, Circle, Pentagon, Bot, Factory,
  Cpu, Code2, Pencil, Atom, Building2,
};

const sectionMap: Record<string, string> = {
  electrical: 'electrical',
  mechanical: 'mechanical',
  conversions: 'conversions',
  materials: 'materials',
  robotics: 'robotics',
  manufacturing: 'manufacturing',
  electronics: 'electronics',
  mathematics: 'mathematics',
  physics: 'physics',
  aerospace: 'aerospace',
  civil: 'civil',
  rf: 'rf',
  programming: 'programming',
  reference: 'reference',
  cad: 'cad',
};

interface CalculatorCardProps {
  calculator: Calculator;
  compact?: boolean;
}

export function CalculatorCard({ calculator, compact = false }: CalculatorCardProps) {
  const { setActiveCalculator, setActiveSection, toggleFavorite, isFavorite, addRecentCalculator } = useApp();
  const IconComponent = iconMap[calculator.icon] ?? Zap;
  const favorite = isFavorite(calculator.id);

  const handleOpen = () => {
    addRecentCalculator(calculator.id);
    setActiveCalculator(calculator.id);
    const section = sectionMap[calculator.category] ?? 'dashboard';
    setActiveSection(section as never);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(calculator.id);
  };

  if (compact) {
    return (
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-3 p-2 border border-classic-border bg-classic-input hover:bg-classic-panel hover:border-classic-accent transition-all duration-100 text-left shadow-sm"
      >
        <div className="p-1.5 bg-classic-bg border border-classic-border text-classic-accent">
          <IconComponent size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-classic-text truncate">{calculator.title}</p>
          <p className="text-[10px] text-classic-muted truncate capitalize">{calculator.category}</p>
        </div>
        <Star
          size={14}
          className={`flex-shrink-0 transition-colors ${favorite ? 'text-[#ffb700] fill-[#ffb700]' : 'text-classic-muted hover:text-classic-text'}`}
          onClick={handleFavorite}
        />
      </button>
    );
  }

  return (
    <div
      className="flex flex-col border border-classic-border p-4 cursor-pointer bg-classic-input hover:border-classic-accent hover:shadow-sm transition-all duration-100"
      onClick={handleOpen}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-classic-bg border border-classic-border text-classic-accent">
          <IconComponent size={18} />
        </div>
        <button
          onClick={handleFavorite}
          className="p-1.5 bg-classic-bg border border-transparent hover:border-classic-border transition-colors"
        >
          <Star
            size={14}
            className={`transition-all ${favorite ? 'text-[#ffb700] fill-[#ffb700]' : 'text-classic-muted hover:text-classic-text'}`}
          />
        </button>
      </div>
      <h3 className="text-sm font-bold text-classic-text mb-1">{calculator.title}</h3>
      <p className="text-xs text-classic-muted leading-relaxed flex-1">{calculator.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] font-semibold px-2 py-0.5 border border-classic-border bg-classic-bg text-classic-muted capitalize">
          {calculator.category}
        </span>
        <span className="text-xs text-classic-accent font-medium">Open →</span>
      </div>
    </div>
  );
}
