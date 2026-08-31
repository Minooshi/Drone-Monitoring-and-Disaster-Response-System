import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanFace,
  ArrowUpRight,
  Map,
  Bell,
  BarChart3,
  Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ScanFace, label: 'Thermal Stream', path: 'http://192.168.8.200', external: true },
  { icon: Map, label: 'Partner Map', path: '/partner-map' },
  { icon: Bell, label: 'Alerts', path: '/alerts' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-outline-variant/10 bg-surface/70 backdrop-blur-xl flex flex-col h-full py-6 z-50 transition-colors duration-300">
      <div className="px-6 mb-10">
        <h1 className="text-lg font-bold tracking-widest text-primary uppercase font-headline leading-tight">
          Drone Monitoring
        </h1>
        <p className="font-headline tracking-widest text-[10px] uppercase text-on-surface-variant font-bold">
          System
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          item.external ? (
            <a
              key={item.label}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group font-headline tracking-tight text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-primary" />
                <span>{item.label}</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group font-headline tracking-tight text-sm",
                isActive
                  ? "bg-primary/10 text-primary border-r-2 border-primary font-bold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          )
        ))}
      </nav>


    </aside>
  );
}
