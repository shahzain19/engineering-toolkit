export type Category = 'electrical' | 'mechanical' | 'conversions' | 'materials';

export interface Calculator {
  id: string;
  title: string;
  description: string;
  category: Category;
  icon: string;
  tags: string[];
  featured?: boolean;
}

export interface CalculationHistory {
  id: string;
  calculatorId: string;
  calculatorTitle: string;
  inputs: Record<string, string | number>;
  result: string;
  timestamp: number;
}

export interface AppSettings {
  favorites: string[];
  recentCalculators: string[];
}

export type SidebarSection = 'dashboard' | 'electrical' | 'mechanical' | 'conversions' | 'materials' | 'favorites' | 'settings';

export interface ResistorBand {
  color: string;
  value: number | null;
  multiplier?: number;
  tolerance?: string;
}

export interface ConversionUnit {
  label: string;
  factor: number; // relative to base unit
  offset?: number; // for temperature
}

export interface ConversionCategory {
  name: string;
  baseUnit: string;
  units: ConversionUnit[];
}
