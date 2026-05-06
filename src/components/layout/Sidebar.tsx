import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bell, 
  Rocket, 
  UserSearch, 
  Thermometer, 
  Radar, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Bell, label: 'Alerts', path: '/alerts' },
  { icon: Rocket, label: 'Drone Mission', path: '/mission' },
  { icon: UserSearch, label: 'Victim Detection', path: '/detection' },
  { icon: Thermometer, label: 'Thermal', path: '/thermal' },
  { icon: Radar, label: 'GPR Scan', path: '/gpr' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-outline-variant/10 bg-slate-950/70 backdrop-blur-xl flex flex-col h-full py-6 z-50">
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
        ))}
      </nav>


    </aside>
  );
}
