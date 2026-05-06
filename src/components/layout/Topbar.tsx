import React, { useEffect, useRef } from 'react';
import { Bell, SunMoon, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useDrone } from '../../lib/DroneContext';

export function Topbar() {
  const { status } = useDrone();
  const isInFlight = status === 'In Flight';
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    
    const updateTime = () => {
      if (timeRef.current) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeRef.current.textContent = `${hours}:${minutes}:${seconds}`;
      }
      animationFrameId = requestAnimationFrame(updateTime);
    };
    
    animationFrameId = requestAnimationFrame(updateTime);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <header className="h-16 border-b border-outline-variant/10 bg-slate-950/80 backdrop-blur-md flex justify-between items-center px-8 z-40">
      <div className="flex items-center gap-6">

        <div className="flex items-center gap-2">
          <span className={clsx(
            "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] animate-pulse",
            isInFlight ? "bg-secondary text-secondary" : "bg-error text-error"
          )}></span>
          <span className="font-headline font-medium text-sm uppercase tracking-widest text-on-surface flex items-center gap-2">
            TIME: <span ref={timeRef} className="font-mono text-xl font-bold tracking-wider w-[100px] inline-block">00:00:00</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={clsx(
          "flex items-center px-3 py-1 rounded-full border transition-colors duration-300",
          isInFlight 
            ? "bg-secondary/10 border-secondary/30 text-secondary" 
            : "bg-error/10 border-error/30 text-error"
        )}>
          <span className="font-headline text-[10px] font-bold tracking-widest uppercase">
            {status}
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
              <User className="w-5 h-5 text-on-surface-variant" />
            </div>
            <span className="font-headline text-xs font-bold text-on-surface uppercase">Observer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
