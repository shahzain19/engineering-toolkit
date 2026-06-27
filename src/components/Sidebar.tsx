'use client';

import React from 'react';
import {
  LayoutDashboard, Zap, Cog, ArrowLeftRight, FlaskConical,
  Star, Settings, ChevronLeft, ChevronRight, Cpu,
} from 'lucide-react';
import type { SidebarSection } from '@/types';
import { useApp } from '@/context/AppContext';

const navItems: { id: SidebarSection; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'electrical', label: 'Electrical', icon: Zap },
  { id: 'mechanical', label: 'Mechanical', icon: Cog },
  { id: 'conversions', label: 'Conversions', icon: ArrowLeftRight },
  { id: 'materials', label: 'Materials', icon: FlaskConical },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { activeSection, setActiveSection, settings } = useApp();

  return (
    <aside
      className={`
        hidden md:flex flex-col bg-classic-panel border-r border-classic-border text-gray-200
        transition-all duration-300 ease-in-out flex-shrink-0 h-screen sticky top-0
        ${collapsed ? 'w-16' : 'w-56'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-classic-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="p-1.5 rounded-sm bg-classic-accent">
          <Cpu size={18} className="text-classic-accent-text" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-sm font-bold text-classic-text block leading-tight">Eng Toolkit</span>
            <span className="text-xs text-classic-muted">Professional Suite</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`
                w-full flex items-center rounded-sm transition-all duration-100 text-left relative
                ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'}
                ${isActive
                  ? 'bg-classic-input border border-classic-border text-classic-accent font-semibold shadow-sm'
                  : 'text-classic-muted hover:bg-classic-input hover:text-classic-text border border-transparent'}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={16} className={isActive ? 'text-classic-accent' : 'text-classic-muted'} />
              {!collapsed && (
                <span className="text-sm">{item.label}</span>
              )}
              {!collapsed && item.id === 'favorites' && settings.favorites.length > 0 && (
                <span className="ml-auto text-xs bg-classic-input border border-classic-border px-1.5 py-0.5 rounded-sm">
                  {settings.favorites.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-classic-border bg-classic-bg/50">
        <button
          onClick={onToggle}
          className={`
            w-full flex items-center rounded-sm p-2 text-classic-muted hover:text-classic-text
            hover:bg-classic-input border border-transparent hover:border-classic-border transition-all duration-100
            ${collapsed ? 'justify-center' : 'justify-between gap-2'}
          `}
        >
          {!collapsed && <span className="text-xs font-medium">Collapse</span>}
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
