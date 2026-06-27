'use client';

import React from 'react';
import { FunctionSquare } from 'lucide-react';

interface FormulaDisplayProps {
  formula: string;
  description?: string;
  variables?: { symbol: string; description: string; unit?: string }[];
}

export function FormulaDisplay({ formula, description, variables }: FormulaDisplayProps) {
  return (
    <div className="border border-classic-border bg-classic-panel p-3">
      <div className="flex items-center gap-2 mb-2">
        <FunctionSquare size={14} className="text-classic-accent" />
        <span className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Formula</span>
      </div>
      <div className="font-mono text-base font-bold text-classic-text mb-2 text-center py-2 bg-classic-input border border-classic-border">
        {formula}
      </div>
      {description && <p className="text-xs text-classic-muted text-center mt-2">{description}</p>}
      {variables && variables.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-1 border-t border-classic-border pt-2">
          {variables.map((v) => (
            <div key={v.symbol} className="flex items-center gap-2 text-xs">
              <code className="font-mono text-classic-text font-bold w-6 text-right">{v.symbol}</code>
              <span className="text-classic-muted">=</span>
              <span className="text-classic-muted">{v.description}</span>
              {v.unit && <span className="text-classic-muted ml-auto font-mono">{v.unit}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
