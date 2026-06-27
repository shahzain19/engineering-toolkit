'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { DashboardPage } from '@/views/DashboardPage';
import { ElectricalPage } from '@/views/ElectricalPage';
import { MechanicalPage } from '@/views/MechanicalPage';
import { ConversionsPage } from '@/views/ConversionsPage';
import { MaterialsPage } from '@/views/MaterialsPage';
import { FavoritesPage } from '@/views/FavoritesPage';
import { SettingsPage } from '@/views/SettingsPage';
import { useApp } from '@/context/AppContext';

const pageMap: Record<string, React.ReactNode> = {
  dashboard: <DashboardPage />,
  electrical: <ElectricalPage />,
  mechanical: <MechanicalPage />,
  conversions: <ConversionsPage />,
  materials: <MaterialsPage />,
  favorites: <FavoritesPage />,
  settings: <SettingsPage />,
};

export function AppShell() {
  const { activeSection } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-classic-bg text-classic-text">
      {/* Desktop sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden border-l border-classic-border">
        {/* Mobile top nav */}
        <Navbar />

        {/* Desktop top bar / Toolbar */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 border-b border-classic-border bg-classic-panel flex-shrink-0 shadow-sm">
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-classic-bg p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-5xl mx-auto bg-classic-panel border border-classic-border shadow-sm min-h-full p-4 md:p-6">
            {pageMap[activeSection] ?? <DashboardPage />}
          </div>
        </main>
      </div>
    </div>
  );
}
