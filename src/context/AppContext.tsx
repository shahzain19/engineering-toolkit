'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AppSettings, SidebarSection } from '@/types';
import { getSettings, saveSettings, toggleFavorite as toggleFav, addRecentCalculator as addRecent } from '@/utils/storage';

interface AppContextValue {
  settings: AppSettings;
  activeSection: SidebarSection;
  activeCalculator: string | null;
  sidebarOpen: boolean;
  searchQuery: string;
  resolvedTheme: 'light' | 'dark';
  setActiveSection: (section: SidebarSection) => void;
  setActiveCalculator: (id: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;
  toggleTheme: () => void;
  toggleFavorite: (id: string) => void;
  addRecentCalculator: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({ theme: 'system', favorites: [], recentCalculators: [] });
  const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const loaded = getSettings();
    setSettings(loaded);
  }, []);

  useEffect(() => {
    const resolve = () => {
      if (settings.theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return settings.theme;
    };
    const resolved = resolve();
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [settings.theme]);

  const toggleTheme = useCallback(() => {
    setSettings((prev: AppSettings) => {
      const next: AppSettings = { ...prev, theme: (prev.theme === 'dark' ? 'light' : 'dark') as 'light' | 'dark' };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    toggleFav(id);
    setSettings(getSettings());
  }, []);

  const addRecentCalculator = useCallback((id: string) => {
    addRecent(id);
    setSettings(getSettings());
  }, []);

  const isFavorite = useCallback((id: string) => settings.favorites.includes(id), [settings.favorites]);

  return (
    <AppContext.Provider
      value={{
        settings,
        activeSection,
        activeCalculator,
        sidebarOpen,
        searchQuery,
        resolvedTheme,
        setActiveSection,
        setActiveCalculator,
        setSidebarOpen,
        setSearchQuery,
        toggleTheme,
        toggleFavorite,
        addRecentCalculator,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
