// AppShell — top-level layout: sidebar + toolbar + main content area.
// pageMap maps every SidebarSection to its view component.
// Adding a new section: import the page, add it to pageMap, update Sidebar/Navbar.
'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { DashboardPage } from '@/views/DashboardPage';
import { ElectricalPage } from '@/views/ElectricalPage';
import { MechanicalPage } from '@/views/MechanicalPage';
import { ConversionsPage } from '@/views/ConversionsPage';
import { MaterialsPage } from '@/views/MaterialsPage';
import { FavoritesPage } from '@/views/FavoritesPage';
import { SettingsPage } from '@/views/SettingsPage';
import { RoboticsPage } from '@/views/RoboticsPage';
import { ManufacturingPage } from '@/views/ManufacturingPage';
import { ElectronicsPage } from '@/views/ElectronicsPage';
import { MathematicsPage } from '@/views/MathematicsPage';
import { PhysicsPage } from '@/views/PhysicsPage';
import { AerospacePage } from '@/views/AerospacePage';
import { CivilPage } from '@/views/CivilPage';
import { RFPage } from '@/views/RFPage';
import { ProgrammingPage } from '@/views/ProgrammingPage';
import { ReferencePage } from '@/views/ReferencePage';
import { CADPage } from '@/views/CADPage';
import { useApp } from '@/context/AppContext';

const pageMap: Record<string, React.ReactNode> = {
  dashboard: <DashboardPage />,
  electrical: <ElectricalPage />,
  mechanical: <MechanicalPage />,
  conversions: <ConversionsPage />,
  materials: <MaterialsPage />,
  robotics: <RoboticsPage />,
  manufacturing: <ManufacturingPage />,
  electronics: <ElectronicsPage />,
  mathematics: <MathematicsPage />,
  physics: <PhysicsPage />,
  aerospace: <AerospacePage />,
  civil: <CivilPage />,
  rf: <RFPage />,
  programming: <ProgrammingPage />,
  reference: <ReferencePage />,
  cad: <CADPage />,
  favorites: <FavoritesPage />,
  settings: <SettingsPage />,
};

export function AppShell() {
  const { activeSection } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-classic-bg text-classic-text">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden border-l border-classic-border">
        <Navbar />

        <div className="hidden md:flex items-center gap-3 px-4 py-2 border-b border-classic-border bg-classic-panel flex-shrink-0 shadow-sm">
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-classic-bg p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-5xl mx-auto bg-classic-panel border border-classic-border shadow-sm min-h-full p-4 md:p-6">
            {pageMap[activeSection] ?? <DashboardPage />}
          </div>
        </main>
      </div>
    </div>
  );
}
