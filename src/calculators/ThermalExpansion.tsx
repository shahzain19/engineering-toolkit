'use client';

import React, { useState, useEffect } from 'react';
import { NumberInput, SelectInput } from '@/components/NumberInput';
import { ResultBox } from '@/components/ResultBox';
import { FormulaDisplay } from '@/components/FormulaDisplay';

const MATERIALS = [
  { label: 'Aluminum (23 µm/m·°C)', value: '23' },
  { label: 'Copper (17 µm/m·°C)', value: '17' },
  { label: 'Steel (12 µm/m·°C)', value: '12' },
  { label: 'Iron (11.8 µm/m·°C)', value: '11.8' },
  { label: 'Concrete (12 µm/m·°C)', value: '12' },
  { label: 'Glass (8.5 µm/m·°C)', value: '8.5' },
  { label: 'Wood (parallel) (3 µm/m·°C)', value: '3' },
  { label: 'Custom', value: 'custom' },
];

export function ThermalExpansion() {
  const [material, setMaterial] = useState('23');
  const [customAlpha, setCustomAlpha] = useState('');
  const [initialLength, setInitialLength] = useState('1');
  const [tempChange, setTempChange] = useState('50');
  const [expansion, setExpansion] = useState<string | null>(null);

  useEffect(() => {
    let alpha = 0;
    if (material === 'custom') {
      alpha = parseFloat(customAlpha) * 1e-6;
    } else {
      alpha = parseFloat(material) * 1e-6;
    }

    const L0 = parseFloat(initialLength);
    const dT = parseFloat(tempChange);

    if (!isNaN(alpha) && !isNaN(L0) && !isNaN(dT) && L0 > 0) {
      const dL = alpha * L0 * dT;
      setExpansion((dL * 1000).toFixed(3)); // Convert to mm for display
    } else {
      setExpansion(null);
    }
  }, [material, customAlpha, initialLength, tempChange]);

  return (
    <div className="space-y-6">
      <FormulaDisplay
        formula="ΔL = α × L₀ × ΔT"
        description="Linear thermal expansion formula"
        variables={[
          { symbol: 'ΔL', description: 'Change in length' },
          { symbol: 'α', description: 'Coefficient of linear expansion' },
          { symbol: 'L₀', description: 'Initial length' },
          { symbol: 'ΔT', description: 'Change in temperature' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput
          label="Material (α)"
          value={material}
          onChange={setMaterial}
          options={MATERIALS}
        />
        {material === 'custom' && (
          <NumberInput
            label="Custom α (µm/m·°C)"
            value={customAlpha}
            onChange={setCustomAlpha}
            placeholder="e.g. 15"
          />
        )}
        <NumberInput
          label="Initial Length (L₀)"
          value={initialLength}
          onChange={setInitialLength}
          unit="m"
          placeholder="e.g. 1"
        />
        <NumberInput
          label="Temperature Change (ΔT)"
          value={tempChange}
          onChange={setTempChange}
          unit="°C"
          placeholder="e.g. 50"
        />
      </div>

      <div className="pt-2">
        <ResultBox
          label="Change in Length (ΔL)"
          value={expansion}
          unit="mm"
          highlight
        />
      </div>
    </div>
  );
}
