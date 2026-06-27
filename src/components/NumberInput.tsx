'use client';

import React from 'react';

interface NumberInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  unit,
  placeholder = '0',
  disabled = false,
  error,
  hint,
}: NumberInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-classic-text uppercase tracking-wider">{label}</label>
      <div className="flex">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            flex-1 px-2 py-1.5 bg-classic-input text-classic-text text-sm font-mono border
            placeholder:text-classic-muted focus:outline-none focus:border-classic-accent
            disabled:opacity-50 disabled:bg-classic-bg
            ${error ? 'border-red-500' : 'border-classic-border'}
            ${!unit ? 'rounded-sm' : 'rounded-l-sm'}
          `}
        />
        {unit && (
          <span className="px-3 py-1.5 bg-classic-bg border border-l-0 border-classic-border rounded-r-sm text-classic-muted text-sm font-mono whitespace-nowrap flex items-center">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-classic-muted">{hint}</p>}
    </div>
  );
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export function SelectInput({ label, value, onChange, options, disabled }: SelectInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-classic-text uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="px-2 py-1.5 rounded-sm bg-classic-input border border-classic-border text-classic-text text-sm focus:outline-none focus:border-classic-accent disabled:opacity-50 cursor-pointer font-mono"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
