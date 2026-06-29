'use client';

import React from 'react';
import {
  Menu, Cpu, LayoutDashboard, Zap, Cog, ArrowLeftRight, FlaskConical,
  Star, Settings, Bot, Factory, Atom, Rocket, Building2, Radio, Code2,
  BookOpen, Pencil, Binary,
} from 'lucide-react';
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

const ALL_SECTIONS: { id: SidebarSection; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; group: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'General' },
  { id: 'favorites', label: 'Favorites', icon: Star, group: 'General' },
  { id: 'electrical', label: 'Electrical', icon: Zap, group: 'Engineering' },
  { id: 'mechanical', label: 'Mechanical', icon: Cog, group: 'Engineering' },
  { id: 'electronics', label: 'Electronics', icon: Binary, group: 'Engineering' },
  { id: 'robotics', label: 'Robotics', icon: Bot, group: 'Engineering' },
  { id: 'manufacturing', label: 'Manufacturing', icon: Factory, group: 'Engineering' },
  { id: 'physics', label: 'Physics', icon: Atom, group: 'Science' },
  { id: 'aerospace', label: 'Aerospace', icon: Rocket, group: 'Science' },
  { id: 'civil', label: 'Civil', icon: Building2, group: 'Science' },
  { id: 'rf', label: 'RF / Radio', icon: Radio, group: 'Science' },
  { id: 'conversions', label: 'Conversions', icon: ArrowLeftRight, group: 'Tools' },
  { id: 'mathematics', label: 'Mathematics', icon: LayoutDashboard, group: 'Tools' },
  { id: 'materials', label: 'Materials', icon: FlaskConical, group: 'Tools' },
  { id: 'programming', label: 'Programming', icon: Code2, group: 'Tools' },
  { id: 'reference', label: 'Reference', icon: BookOpen, group: 'Tools' },
  { id: 'cad', label: 'CAD Helpers', icon: Pencil, group: 'Tools' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'App' },
];

const groups = ['General', 'Engineering', 'Science', 'Tools', 'App'];

export function Navbar() {
  const { setSidebarOpen, sidebarOpen, activeSection, setActiveSection } = useApp();

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-classic-panel border-b border-classic-border md:hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 btn-classic">
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

      {/* Mobile bottom nav — 5 most common */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-classic-panel border-t border-classic-border px-2 py-1">
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

      {/* Mobile sidebar overlay — full nav */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-classic-panel border-r border-classic-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-classic-border flex-shrink-0">
              <div className="p-2 bg-classic-accent">
                <Cpu size={16} className="text-classic-accent-text" />
              </div>
              <span className="text-base font-bold text-classic-text">Eng Toolkit</span>
            </div>

            <div className="px-3 py-2 border-b border-classic-border flex-shrink-0">
              <SearchBar />
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-3 space-y-3">
              {groups.map((group) => {
                const items = ALL_SECTIONS.filter((s) => s.group === group);
                return (
                  <div key={group}>
                    <p className="text-[10px] font-bold text-classic-muted uppercase tracking-widest px-1 py-1">
                      {group}
                    </p>
                    <div className="space-y-0.5">
                      {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2 transition-all ${
                              isActive
                                ? 'bg-classic-input text-classic-accent border border-classic-border font-semibold'
                                : 'text-classic-muted hover:bg-classic-input hover:text-classic-text border border-transparent'
                            }`}
                          >
                            <Icon size={16} />
                            <span className="text-sm">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
