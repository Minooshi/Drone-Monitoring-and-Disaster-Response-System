import React from 'react';
import { Bell, SunMoon, User } from 'lucide-react';

export function Topbar() {
  return (
    <header className="h-16 border-b border-outline-variant/10 bg-slate-950/80 backdrop-blur-md flex justify-between items-center px-8 z-40">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="font-headline font-medium text-xs uppercase tracking-widest text-primary">
            Mission: Alpha-7
          </span>
          <span className="font-mono text-[10px] text-on-surface-variant">
            OP_ID: 2948-XJ
          </span>
        </div>
        <div className="h-6 w-px bg-outline-variant/20"></div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#6ffb85] animate-pulse"></span>
          <span className="font-headline font-medium text-xs uppercase tracking-widest text-on-surface">
            Timer: 00:42:15
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-secondary-container/20 px-3 py-1 rounded-full border border-secondary/30">
          <span className="text-secondary font-headline text-[10px] font-bold tracking-widest uppercase">
            In Flight
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <SunMoon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7j69Omr5PR5J6ESdx8UmG7FRaQbwlMiIW_ZdoA5BjwQFnW9f7jQin_U9ZFhU93_5GAVLGxR1huFSpJ7BXxa0WiystiJje47YYYOEQP1iSksOVauNnKG3QbdfgBSFtsFK5usPUKyTz1zQXomQA2RS3X0BUFENeydJrcztwjIy71VOanVR16Zud7R8EWCvlhBf9043b-GBpx2FSwNbeEMVIDmOD_iQQTKUMbdhrtnaBxPKz7NP-ibc_e803gvi1iKF90OTNGsHkVlA" 
                alt="Commander"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-headline text-xs font-bold text-on-surface">CMDR. VANCE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
