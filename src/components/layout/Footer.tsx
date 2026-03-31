import React from 'react';
import { MapPin, ArrowUp, Activity, BatteryCharging } from 'lucide-react';

export function Footer() {
  return (
    <footer className="h-10 border-t border-outline-variant/10 bg-slate-950/90 backdrop-blur-2xl flex justify-around items-center px-6 z-50">
      <div className="flex items-center gap-2 text-secondary font-mono text-[10px] tracking-tighter">
        <MapPin className="w-3 h-3" />
        <span>42.3601° N, 71.0589° W</span>
      </div>
      <div className="flex items-center gap-2 text-secondary font-mono text-[10px] tracking-tighter">
        <ArrowUp className="w-3 h-3" />
        <span>ALT: 120m</span>
      </div>
      <div className="flex items-center gap-2 text-secondary font-mono text-[10px] tracking-tighter">
        <Activity className="w-3 h-3" />
        <span>SIG: 98%</span>
      </div>
      <div className="flex items-center gap-2 text-secondary font-mono text-[10px] tracking-tighter">
        <BatteryCharging className="w-3 h-3" />
        <span>BAT: 84%</span>
      </div>
    </footer>
  );
}
