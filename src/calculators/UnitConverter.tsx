'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { CONVERSION_CATEGORIES } from '@/data/calculators';
import { SelectInput } from '@/components/NumberInput';
import { addHistory } from '@/utils/storage';

function convertTemperature(value: number, fromIdx: number, toIdx: number): number {
  // Convert everything to Kelvin first, then to target
  const toKelvin = (v: number, idx: number): number => {
    if (idx === 0) return v + 273.15;         // Celsius
    if (idx === 1) return (v + 459.67) * (5 / 9); // Fahrenheit
    return v;                                  // Kelvin
  };
  const fromKelvin = (k: number, idx: number): number => {
    if (idx === 0) return k - 273.15;
    if (idx === 1) return k * (9 / 5) - 459.67;
    return k;
  };
  return fromKelvin(toKelvin(value, fromIdx), toIdx);
}

export function UnitConverter() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [fromUnitIndex, setFromUnitIndex] = useState(0);
  const [toUnitIndex, setToUnitIndex] = useState(1);
  const [inputValue, setInputValue] = useState('');

  const category = CONVERSION_CATEGORIES[categoryIndex];
  const isTemp = category.name === 'Temperature';

  const result = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '';
    if (isTemp) {
      return convertTemperature(val, fromUnitIndex, toUnitIndex).toFixed(6).replace(/\.?0+$/, '');
    }
    const fromFactor = category.units[fromUnitIndex].factor;
    const toFactor = category.units[toUnitIndex].factor;
    const inBase = val * fromFactor;
    const converted = inBase / toFactor;
    if (Math.abs(converted) >= 1e9 || (Math.abs(converted) < 1e-4 && converted !== 0)) {
      return converted.toExponential(6);
    }
    return parseFloat(converted.toFixed(8)).toString();
  }, [inputValue, categoryIndex, fromUnitIndex, toUnitIndex, isTemp]);

  const swap = useCallback(() => {
    setFromUnitIndex(toUnitIndex);
    setToUnitIndex(fromUnitIndex);
    setInputValue(result);
  }, [fromUnitIndex, toUnitIndex, result]);

  const handleCategory = (val: string) => {
    const idx = parseInt(val);
    setCategoryIndex(idx);
    setFromUnitIndex(0);
    setToUnitIndex(1);
    setInputValue('');
  };

  const handleSave = () => {
    if (!result) return;
    addHistory({
      calculatorId: 'unit-converter',
      calculatorTitle: 'Unit Converter',
      inputs: { value: inputValue, from: category.units[fromUnitIndex].label, to: category.units[toUnitIndex].label },
      result: `${inputValue} ${category.units[fromUnitIndex].label} = ${result} ${category.units[toUnitIndex].label}`,
    });
  };

  const unitOptions = category.units.map((u, i) => ({ value: String(i), label: u.label }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-green-500/15 text-green-400"><ArrowLeftRight size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Unit Converter</h2>
          <p className="text-sm text-slate-400">Real-time conversion across multiple unit types</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CONVERSION_CATEGORIES.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => handleCategory(String(i))}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
              categoryIndex === i
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Conversion layout */}
      <div className="flex flex-col gap-4">
        {/* From */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">From</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value..."
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 hover:border-slate-400 focus:border-green-500 text-slate-100 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
            />
          </div>
          <select
            value={String(fromUnitIndex)}
            onChange={(e) => setFromUnitIndex(parseInt(e.target.value))}
            className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 hover:border-slate-400 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer transition-all"
          >
            {unitOptions.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ backgroundColor: '#1e293b' }}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 hover:border-green-500/50 hover:bg-green-500/10 text-slate-400 hover:text-green-400 transition-all duration-200"
          >
            <ArrowLeftRight size={16} />
            <span className="text-sm font-medium">Swap Units</span>
          </button>
        </div>

        {/* To */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">To</label>
          <div className="flex gap-2 items-stretch">
            <div className={`flex-1 px-3 py-2.5 rounded-xl bg-slate-900/60 border text-lg font-mono font-bold transition-all ${
              result ? 'border-green-500/50 text-green-400' : 'border-slate-700 text-slate-500'
            }`}>
              {result || '—'}
            </div>
          </div>
          <select
            value={String(toUnitIndex)}
            onChange={(e) => setToUnitIndex(parseInt(e.target.value))}
            className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 hover:border-slate-400 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer transition-all"
          >
            {unitOptions.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ backgroundColor: '#1e293b' }}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Full conversion result display */}
      {result && inputValue && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4">
          <p className="text-base font-semibold text-slate-200 text-center">
            <span className="text-green-400 font-mono">{inputValue}</span>
            <span className="text-slate-400 mx-2">{category.units[fromUnitIndex].label.split('(')[0].trim()}</span>
            <span className="text-slate-500 mx-1">=</span>
            <span className="text-cyan-400 font-mono mx-1">{result}</span>
            <span className="text-slate-400">{category.units[toUnitIndex].label.split('(')[0].trim()}</span>
          </p>
        </div>
      )}

      {/* Common conversions table */}
      {inputValue && !isNaN(parseFloat(inputValue)) && (
        <div className="rounded-xl bg-slate-800/40 border border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">All Conversions for {parseFloat(inputValue)} {category.units[fromUnitIndex].label.split('(')[0].trim()}</p>
          </div>
          <div className="divide-y divide-slate-700/50">
            {category.units.map((unit, i) => {
              if (i === fromUnitIndex) return null;
              let val: string;
              if (isTemp) {
                val = convertTemperature(parseFloat(inputValue), fromUnitIndex, i).toFixed(4).replace(/\.?0+$/, '');
              } else {
                const fromFactor = category.units[fromUnitIndex].factor;
                const base = parseFloat(inputValue) * fromFactor;
                const conv = base / unit.factor;
                val = Math.abs(conv) >= 1e9 || (Math.abs(conv) < 1e-4 && conv !== 0)
                  ? conv.toExponential(4)
                  : parseFloat(conv.toFixed(6)).toString();
              }
              return (
                <div key={i} className="flex items-center justify-between px-4 py-2 hover:bg-slate-700/30 transition-colors">
                  <span className="text-sm text-slate-400">{unit.label}</span>
                  <span className="font-mono text-sm text-slate-200">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={handleSave} className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm hover:from-green-400 hover:to-emerald-400 transition-all duration-200 shadow-lg shadow-green-500/20">
          Save to History
        </button>
        <button onClick={() => { setInputValue(''); }} className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all duration-200">
          <RefreshCw size={18} />
        </button>
      </div>
    </div>
  );
}
