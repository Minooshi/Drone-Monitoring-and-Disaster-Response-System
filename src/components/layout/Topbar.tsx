import React, { useEffect, useRef, useState } from 'react';
import { Bell, SunMoon, User, Database } from 'lucide-react';
import { clsx } from 'clsx';
import { useDrone } from '../../lib/DroneContext';
import { useTheme } from '../../lib/ThemeContext';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const navigate = useNavigate();
  const { status } = useDrone();
  const { theme, toggleTheme } = useTheme();
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const isInFlight = status === 'In Flight';
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkDb = async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        setDbStatus(data.status);
      } catch (err) {
        setDbStatus('disconnected');
      }
    };
    
    checkDb();
    const interval = setInterval(checkDb, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

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
    <header className="h-16 border-b border-outline-variant/10 bg-surface/80 backdrop-blur-md flex justify-between items-center px-8 z-40 transition-colors duration-300">
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
        {/* DB Status Badge */}
        <div className={clsx(
          "flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300",
          dbStatus === 'connected' ? "bg-green-500/10 border-green-500/30 text-green-500" :
          dbStatus === 'disconnected' ? "bg-error/10 border-error/30 text-error" :
          "bg-on-surface-variant/10 border-outline-variant/30 text-on-surface-variant animate-pulse"
        )}>
          <Database className="w-3 h-3" />
          <span className="font-headline text-[10px] font-bold tracking-widest uppercase">
            DB: {dbStatus}
          </span>
        </div>

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
          <button 
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => navigate('/alerts')}
            title="View Tactical Alerts"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <SunMoon className="w-5 h-5" />
          </button>
          <div 
            className="flex items-center gap-3 pl-4 border-l border-outline-variant/20 cursor-pointer group"
            onClick={() => navigate('/settings')}
          >
            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
              <User className="w-5 h-5 text-on-surface-variant group-hover:text-primary" />
            </div>
            <span className="font-headline text-xs font-bold text-on-surface uppercase group-hover:text-primary">Observer</span>
          </div>
        </div>
      </div>
    </header>
  );
}


