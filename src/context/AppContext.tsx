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
  setActiveSection: (section: SidebarSection) => void;
  setActiveCalculator: (id: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;
  toggleFavorite: (id: string) => void;
  addRecentCalculator: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({ favorites: [], recentCalculators: [] });
  const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loaded = getSettings();
    setSettings(loaded);
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
        setActiveSection,
        setActiveCalculator,
        setSidebarOpen,
        setSearchQuery,
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
