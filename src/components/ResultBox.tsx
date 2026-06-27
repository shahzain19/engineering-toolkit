'use client';

import React, { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { copyToClipboard } from '@/utils/storage';

interface ResultBoxProps {
  label: string;
  value: string | null;
  unit?: string;
  highlight?: boolean;
}

export function ResultBox({ label, value, unit, highlight = false }: ResultBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await copyToClipboard(`${value}${unit ? ` ${unit}` : ''}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`
        relative rounded-sm p-3 border
        ${highlight
          ? 'bg-[#ffffcc] dark:bg-[#333300] border-classic-border'
          : 'bg-classic-input border-classic-border'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-1">{label}</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-mono text-xl font-bold break-all text-classic-text"
            >
              {value ?? '—'}
            </span>
            {unit && value && (
              <span className="text-classic-muted text-sm font-medium">{unit}</span>
            )}
          </div>
        </div>
        {value && (
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1.5 rounded-sm bg-classic-panel border border-classic-border hover:bg-classic-input text-classic-muted hover:text-classic-text transition-all duration-100"
            title="Copy result"
          >
            {copied ? (
              <CheckCircle2 size={16} className="text-green-500" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
