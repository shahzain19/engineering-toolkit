import type { CalculationHistory, AppSettings } from '@/types';

const HISTORY_KEY = 'eng_toolkit_history';
const SETTINGS_KEY = 'eng_toolkit_settings';

export function getHistory(): CalculationHistory[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistory(entry: Omit<CalculationHistory, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const newEntry: CalculationHistory = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
  };
  const updated = [newEntry, ...history].slice(0, 50); // keep last 50
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return { theme: 'system', favorites: [], recentCalculators: [] };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? JSON.parse(raw)
      : { theme: 'system', favorites: [], recentCalculators: [] };
  } catch {
    return { theme: 'system', favorites: [], recentCalculators: [] };
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function toggleFavorite(id: string): boolean {
  const settings = getSettings();
  const isFav = settings.favorites.includes(id);
  settings.favorites = isFav
    ? settings.favorites.filter((f) => f !== id)
    : [id, ...settings.favorites];
  saveSettings(settings);
  return !isFav;
}

export function addRecentCalculator(id: string): void {
  const settings = getSettings();
  settings.recentCalculators = [id, ...settings.recentCalculators.filter((r) => r !== id)].slice(0, 8);
  saveSettings(settings);
}

export function formatNumber(value: number, decimals = 4): string {
  if (!isFinite(value)) return 'Invalid';
  if (Math.abs(value) >= 1e6 || (Math.abs(value) < 1e-3 && value !== 0)) {
    return value.toExponential(3);
  }
  return parseFloat(value.toFixed(decimals)).toString();
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
