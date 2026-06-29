'use client';

import React from 'react';
import {
  LayoutDashboard, Zap, Cog, ArrowLeftRight, FlaskConical,
  Star, Settings, ChevronLeft, ChevronRight, Cpu,
  Bot, Factory, Atom, Rocket, Building2, Radio, Code2,
  BookOpen, Pencil, Binary,
} from 'lucide-react';
import type { SidebarSection } from '@/types';
import { useApp } from '@/context/AppContext';

interface NavItem {
  id: SidebarSection;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'General',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'favorites', label: 'Favorites', icon: Star },
    ],
  },
  {
    label: 'Engineering',
    items: [
      { id: 'electrical', label: 'Electrical', icon: Zap },
      { id: 'mechanical', label: 'Mechanical', icon: Cog },
      { id: 'electronics', label: 'Electronics', icon: Binary },
      { id: 'robotics', label: 'Robotics', icon: Bot },
      { id: 'manufacturing', label: 'Manufacturing', icon: Factory },
    ],
  },
  {
    label: 'Science',
    items: [
      { id: 'physics', label: 'Physics', icon: Atom },
      { id: 'aerospace', label: 'Aerospace', icon: Rocket },
      { id: 'civil', label: 'Civil', icon: Building2 },
      { id: 'rf', label: 'RF / Radio', icon: Radio },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'conversions', label: 'Conversions', icon: ArrowLeftRight },
      { id: 'mathematics', label: 'Mathematics', icon: LayoutDashboard },
      { id: 'materials', label: 'Materials', icon: FlaskConical },
      { id: 'programming', label: 'Programming', icon: Code2 },
      { id: 'reference', label: 'Reference', icon: BookOpen },
      { id: 'cad', label: 'CAD Helpers', icon: Pencil },
    ],
  },
  {
    label: 'App',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

// flat list for collapsed mode
const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { activeSection, setActiveSection, settings } = useApp();

  return (
    <aside
      className={`
        hidden md:flex flex-col bg-classic-panel border-r border-classic-border
        transition-all duration-200 ease-in-out flex-shrink-0 h-screen sticky top-0
        ${collapsed ? 'w-14' : 'w-52'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-3 py-3 border-b border-classic-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="p-1.5 bg-classic-accent flex-shrink-0">
          <Cpu size={16} className="text-classic-accent-text" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="text-sm font-bold text-classic-text block leading-tight">Eng Toolkit</span>
            <span className="text-xs text-classic-muted">Professional Suite</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {collapsed ? (
          // Collapsed: just icons, no groups
          <div className="px-1 space-y-0.5">
            {ALL_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  title={item.label}
                  className={`
                    w-full flex justify-center p-2 transition-all duration-100
                    ${isActive
                      ? 'bg-classic-input border border-classic-border text-classic-accent'
                      : 'text-classic-muted hover:bg-classic-input hover:text-classic-text border border-transparent'}
                  `}
                >
                  <Icon size={15} />
                </button>
              );
            })}
          </div>
        ) : (
          // Expanded: grouped
          <div className="px-2 space-y-3">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold text-classic-muted uppercase tracking-widest px-2 py-1 mt-1">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`
                          w-full flex items-center gap-2.5 px-2.5 py-1.5 text-left transition-all duration-100
                          ${isActive
                            ? 'bg-classic-input border border-classic-border text-classic-accent font-semibold'
                            : 'text-classic-muted hover:bg-classic-input hover:text-classic-text border border-transparent'}
                        `}
                      >
                        <Icon size={14} className={isActive ? 'text-classic-accent' : 'text-classic-muted'} />
                        <span className="text-xs flex-1">{item.label}</span>
                        {item.id === 'favorites' && settings.favorites.length > 0 && (
                          <span className="text-[10px] bg-classic-input border border-classic-border px-1 py-0.5 font-mono">
                            {settings.favorites.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-classic-border">
        <button
          onClick={onToggle}
          className={`
            w-full flex items-center p-2 text-classic-muted hover:text-classic-text
            hover:bg-classic-input border border-transparent hover:border-classic-border transition-all duration-100
            ${collapsed ? 'justify-center' : 'justify-between gap-2'}
          `}
        >
          {!collapsed && <span className="text-xs font-medium">Collapse</span>}
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
}
