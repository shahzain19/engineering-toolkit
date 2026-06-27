'use client';

import React, { useState, useEffect } from 'react';
import { NumberInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';

export function ParallelResistors() {
  const [r1, setR1] = useState('100');
  const [r2, setR2] = useState('100');
  const [r3, setR3] = useState('');
  const [r4, setR4] = useState('');
  const [req, setReq] = useState<string | null>(null);

  useEffect(() => {
    const r1Val = parseFloat(r1);
    const r2Val = parseFloat(r2);
    const r3Val = r3 ? parseFloat(r3) : null;
    const r4Val = r4 ? parseFloat(r4) : null;

    let sum = 0;
    let count = 0;

    if (!isNaN(r1Val) && r1Val > 0) { sum += 1 / r1Val; count++; }
    if (!isNaN(r2Val) && r2Val > 0) { sum += 1 / r2Val; count++; }
    if (r3Val !== null && !isNaN(r3Val) && r3Val > 0) { sum += 1 / r3Val; count++; }
    if (r4Val !== null && !isNaN(r4Val) && r4Val > 0) { sum += 1 / r4Val; count++; }

    if (count > 0 && sum > 0) {
      const result = 1 / sum;
      // Format nicely
      setReq(result < 1 ? result.toPrecision(3) : result.toFixed(2));
    } else {
      setReq(null);
    }
  }, [r1, r2, r3, r4]);

  return (
    <div className="space-y-6">
      <FormulaDisplay
        formula="1/Req = 1/R1 + 1/R2 + ..."
        description="Equivalent resistance of components connected in parallel"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput
          label="Resistor 1 (R1)"
          value={r1}
          onChange={setR1}
          unit="Ω"
          placeholder="e.g. 100"
        />
        <NumberInput
          label="Resistor 2 (R2)"
          value={r2}
          onChange={setR2}
          unit="Ω"
          placeholder="e.g. 100"
        />
        <NumberInput
          label="Resistor 3 (R3) - Optional"
          value={r3}
          onChange={setR3}
          unit="Ω"
          placeholder="Optional"
        />
        <NumberInput
          label="Resistor 4 (R4) - Optional"
          value={r4}
          onChange={setR4}
          unit="Ω"
          placeholder="Optional"
        />
      </div>

      <div className="pt-2">
        <ResultBox
          label="Equivalent Resistance (Req)"
          value={req}
          unit="Ω"
          highlight
        />
      </div>
    </div>
  );
}
