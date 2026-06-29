'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';
import { formatNumber, addHistory } from '@/utils/storage';

type SolveFor = 'frequency' | 'period' | 'duty';

export function PWMFrequencyCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>('frequency');
  const [period, setPeriod] = useState('');
  const [frequency, setFrequency] = useState('');
  const [onTime, setOnTime] = useState('');
  const [dutyPct, setDutyPct] = useState('');
  const [timerClock, setTimerClock] = useState('');
  const [prescaler, setPrescaler] = useState('1');
  const [result, setResult] = useState<{ main: string; secondary: string; timerPeriod?: string } | null>(null);
  const [error, setError] = useState('');

  const prescalerOptions = [
    { value: '1', label: '÷1' }, { value: '8', label: '÷8' },
    { value: '64', label: '÷64' }, { value: '256', label: '÷256' },
    { value: '1024', label: '÷1024' },
  ];

  const calculate = useCallback(() => {
    setError('');

    if (solveFor === 'frequency') {
      const T_us = parseFloat(period);
      if (isNaN(T_us) || T_us <= 0) return setError('Enter a valid period.');
      const f = 1e6 / T_us;
      const duty = parseFloat(dutyPct);
      const ton = !isNaN(duty) ? formatNumber((duty / 100) * T_us, 2) : '—';
      setResult({ main: formatNumber(f, 4), secondary: `Period: ${T_us} µs · ON time: ${ton} µs` });
      addHistory({ calculatorId: 'pwm-frequency', calculatorTitle: 'PWM Frequency', inputs: { period: T_us }, result: `f = ${formatNumber(f, 4)} Hz` });

    } else if (solveFor === 'period') {
      const f = parseFloat(frequency);
      if (isNaN(f) || f <= 0) return setError('Enter a valid frequency.');
      const T_us = 1e6 / f;
      const duty = parseFloat(dutyPct);
      const ton = !isNaN(duty) ? formatNumber((duty / 100) * T_us, 2) : '—';
      let timerStr: string | undefined;
      const clk = parseFloat(timerClock) * 1e6;
      const pre = parseInt(prescaler);
      if (!isNaN(clk) && clk > 0) {
        const top = clk / (pre * f) - 1;
        timerStr = `TOP ≈ ${formatNumber(top, 0)} (at ${timerClock}MHz ÷${pre})`;
      }
      setResult({ main: formatNumber(T_us, 4), secondary: `f: ${f} Hz · ON time: ${ton} µs`, timerPeriod: timerStr });
      addHistory({ calculatorId: 'pwm-frequency', calculatorTitle: 'PWM Frequency', inputs: { frequency: f }, result: `T = ${formatNumber(T_us, 4)} µs` });

    } else {
      const ton = parseFloat(onTime);
      const T_us = parseFloat(period);
      if (isNaN(ton) || isNaN(T_us) || T_us <= 0) return setError('Enter on-time and period.');
      if (ton > T_us) return setError('On-time cannot exceed period.');
      const duty = (ton / T_us) * 100;
      setResult({ main: formatNumber(duty, 2), secondary: `On-time: ${ton} µs / Period: ${T_us} µs` });
      addHistory({ calculatorId: 'pwm-frequency', calculatorTitle: 'PWM Frequency', inputs: { onTime: ton, period: T_us }, result: `Duty = ${formatNumber(duty, 2)}%` });
    }
  }, [solveFor, period, frequency, onTime, dutyPct, timerClock, prescaler]);

  const reset = () => { setPeriod(''); setFrequency(''); setOnTime(''); setDutyPct(''); setResult(null); setError(''); };

  const modes: { value: SolveFor; label: string }[] = [
    { value: 'frequency', label: 'Frequency' },
    { value: 'period', label: 'Period' },
    { value: 'duty', label: 'Duty Cycle' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Activity size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">PWM Frequency Calculator</h2>
          <p className="text-sm text-classic-muted">Calculate PWM frequency, period, duty cycle, and timer values</p>
        </div>
      </div>

      <FormulaDisplay
        formula="f = 1/T    D = t_on / T × 100%"
        description="PWM frequency and duty cycle relationships"
        variables={[
          { symbol: 'f', description: 'Frequency', unit: 'Hz' },
          { symbol: 'T', description: 'Period', unit: 'µs' },
          { symbol: 'D', description: 'Duty Cycle', unit: '%' },
          { symbol: 't_on', description: 'On-time', unit: 'µs' },
        ]}
      />

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Solve For</p>
        <div className="grid grid-cols-3 gap-2">
          {modes.map((m) => (
            <button key={m.value} onClick={() => { setSolveFor(m.value); setResult(null); setError(''); }}
              className={`py-2 px-3 text-sm font-medium border transition-colors ${solveFor === m.value ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {solveFor !== 'frequency' && (
          <NumberInput label="Period (T)" value={period} onChange={setPeriod} unit="µs" placeholder="e.g. 1000" />
        )}
        {solveFor !== 'period' && (
          <NumberInput label="Frequency (f)" value={frequency} onChange={setFrequency} unit="Hz" placeholder="e.g. 1000" />
        )}
        {solveFor === 'duty' && (
          <NumberInput label="On-time (t_on)" value={onTime} onChange={setOnTime} unit="µs" placeholder="e.g. 250" />
        )}
        {solveFor !== 'duty' && (
          <NumberInput label="Duty Cycle (optional)" value={dutyPct} onChange={setDutyPct} unit="%" placeholder="e.g. 50" />
        )}
        {solveFor === 'period' && (
          <>
            <NumberInput label="Timer Clock (optional)" value={timerClock} onChange={setTimerClock} unit="MHz" placeholder="e.g. 16" />
            <SelectInput label="Prescaler" value={prescaler} onChange={setPrescaler} options={prescalerOptions} />
          </>
        )}
      </div>

      {error && <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3">{error}</div>}

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 py-2.5 px-6 bg-classic-accent text-classic-accent-text font-bold text-sm hover:bg-classic-accent-hover transition-colors border border-classic-border">
          Calculate
        </button>
        <button onClick={reset} className="p-2.5 bg-classic-panel border border-classic-border text-classic-muted hover:text-classic-text transition-colors" title="Reset">
          <RefreshCw size={18} />
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <ResultBox
            label={solveFor === 'frequency' ? 'Frequency' : solveFor === 'period' ? 'Period' : 'Duty Cycle'}
            value={result.main}
            unit={solveFor === 'frequency' ? 'Hz' : solveFor === 'period' ? 'µs' : '%'}
            highlight
          />
          <div className="bg-classic-bg border border-classic-border px-4 py-2 text-xs font-mono text-classic-muted">{result.secondary}</div>
          {result.timerPeriod && (
            <div className="bg-classic-bg border border-classic-border px-4 py-2 text-xs font-mono text-classic-text">{result.timerPeriod}</div>
          )}
        </div>
      )}

      {/* PWM waveform visual */}
      {result && solveFor !== 'duty' && (
        <div className="border border-classic-border bg-classic-bg p-3">
          <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Waveform Preview</p>
          {(() => {
            const duty = parseFloat(dutyPct) || 50;
            const w = 200;
            const h = 40;
            const onW = (duty / 100) * w;
            return (
              <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-sm h-12">
                <polyline points={`0,${h} 0,5 ${onW},5 ${onW},${h} ${w},${h}`} fill="none" stroke="#333" strokeWidth="2" />
                <text x={onW / 2} y="3" textAnchor="middle" fontSize="7" fill="#666">{duty}%</text>
              </svg>
            );
          })()}
        </div>
      )}
    </div>
  );
}
