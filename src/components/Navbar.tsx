'use client';

import React from 'react';
import { Menu, Cpu, LayoutDashboard, Zap, Cog, ArrowLeftRight, FlaskConical, Star, Settings } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { useApp } from '@/context/AppContext';
import type { SidebarSection } from '@/types';

const mobileNavItems: { id: SidebarSection; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'electrical', label: 'Electrical', icon: Zap },
  { id: 'mechanical', label: 'Mechanical', icon: Cog },
  { id: 'conversions', label: 'Convert', icon: ArrowLeftRight },
  { id: 'favorites', label: 'Favorites', icon: Star },
];

export function Navbar() {
  const { setSidebarOpen, sidebarOpen, activeSection, setActiveSection } = useApp();

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-classic-panel border-b border-classic-border md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 btn-classic"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-classic-accent">
            <Cpu size={14} className="text-classic-accent-text" />
          </div>
          <span className="text-sm font-bold text-classic-text">Eng Toolkit</span>
        </div>
        <div className="flex-1" />
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-classic-panel border-t border-classic-border px-2 py-1 safe-area-pb">
        <div className="flex items-center justify-around">
          {mobileNavItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-all duration-100 ${
                  isActive ? 'text-classic-accent' : 'text-classic-muted hover:text-classic-text'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-classic-panel border-r border-classic-border p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-classic-accent">
                <Cpu size={18} className="text-classic-accent-text" />
              </div>
              <span className="text-base font-bold text-classic-text">Eng Toolkit</span>
            </div>
            <SearchBar />
            <div className="mt-4 space-y-1">
              {([
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'electrical', label: 'Electrical', icon: Zap },
                { id: 'mechanical', label: 'Mechanical', icon: Cog },
                { id: 'conversions', label: 'Conversions', icon: ArrowLeftRight },
                { id: 'materials', label: 'Materials', icon: FlaskConical },
                { id: 'favorites', label: 'Favorites', icon: Star },
                { id: 'settings', label: 'Settings', icon: Settings },
              ] as const).map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all ${
                      isActive ? 'bg-classic-input text-classic-accent border border-classic-border' : 'text-classic-muted hover:bg-classic-input hover:text-classic-text border border-transparent'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
