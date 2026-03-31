import React from 'react';
import { Card } from '../components/ui/Card';
import { 
  Target, 
  Navigation, 
  Map as MapIcon, 
  Activity, 
  Wind, 
  Droplets, 
  Zap,
  Maximize2,
  Minimize2,
  Settings,
  Play,
  Square
} from 'lucide-react';
import { motion } from 'motion/react';

export function Mission() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-widest">Mission Control</h2>
          <p className="text-[10px] font-headline font-bold text-primary tracking-[0.3em] uppercase mt-1">Operational Oversight & Command</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-error text-on-error font-headline text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2">
            <Square className="w-4 h-4" /> Abort Mission
          </button>
          <button className="px-6 py-2.5 bg-secondary text-on-secondary font-headline text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2">
            <Play className="w-4 h-4" /> Resume Mission
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Viewport */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="aspect-video bg-surface-container-low rounded-3xl relative overflow-hidden border border-outline-variant/10 shadow-2xl">
            <img 
              src="https://picsum.photos/seed/droneview/1280/720" 
              alt="Live Feed" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 scan-line pointer-events-none opacity-30"></div>
            
            {/* HUD Overlays */}
            <div className="absolute top-8 left-8 space-y-4">
              <div className="glass-panel p-4 rounded-2xl border border-primary/30">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-headline font-bold text-on-surface uppercase tracking-widest">Flight Telemetry</span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[10px]">
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant">ALT:</span>
                    <span className="text-primary">124.5M</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant">SPD:</span>
                    <span className="text-primary">42.8KM/H</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant">HDG:</span>
                    <span className="text-primary">284° NW</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant">PITCH:</span>
                    <span className="text-primary">2.4°</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-8 right-8 flex flex-col gap-2">
              <button className="p-3 glass-panel rounded-xl text-on-surface hover:text-primary transition-all">
                <Maximize2 className="w-5 h-5" />
              </button>
              <button className="p-3 glass-panel rounded-xl text-on-surface hover:text-primary transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-32 h-32 border-2 border-primary/40 rounded-full relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-primary"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-primary"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full"></div>
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div className="glass-panel p-4 rounded-2xl flex gap-8">
                <div className="flex flex-col items-center gap-1">
                  <Zap className="w-4 h-4 text-secondary" />
                  <span className="text-[10px] font-mono text-secondary">84%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Wind className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-mono text-primary">12KT</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Droplets className="w-4 h-4 text-tertiary" />
                  <span className="text-[10px] font-mono text-tertiary">62%</span>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
                  <span className="text-[10px] font-headline font-bold text-on-surface uppercase tracking-widest">Signal: Stable Link</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Card title="Payload Status" icon={Zap}>
              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant uppercase">Medical Kit A</span>
                  <span className="text-[10px] font-bold text-secondary">READY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant uppercase">Medical Kit B</span>
                  <span className="text-[10px] font-bold text-secondary">READY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant uppercase">Thermal Pod</span>
                  <span className="text-[10px] font-bold text-primary">ACTIVE</span>
                </div>
              </div>
            </Card>
            <Card title="Navigation" icon={Navigation}>
              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant uppercase">Mode</span>
                  <span className="text-[10px] font-bold text-primary">AUTONOMOUS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant uppercase">Target</span>
                  <span className="text-[10px] font-bold text-on-surface">SECTOR 7-B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant uppercase">ETA</span>
                  <span className="text-[10px] font-bold text-secondary">04:12</span>
                </div>
              </div>
            </Card>
            <Card title="Environmental" icon={Wind}>
              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant uppercase">Temp</span>
                  <span className="text-[10px] font-bold text-on-surface">24.2°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant uppercase">Humidity</span>
                  <span className="text-[10px] font-bold text-on-surface">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant uppercase">Pressure</span>
                  <span className="text-[10px] font-bold text-on-surface">1012 MB</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <Card title="Mission Log" icon={Activity} className="h-[400px] flex flex-col">
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
                  <div>
                    <p className="text-[10px] text-on-surface leading-tight">Waypoint {i} reached. Scanning initiated.</p>
                    <span className="text-[8px] font-mono text-on-surface-variant">14:22:0{i}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Quick Actions">
            <div className="grid grid-cols-1 gap-2 mt-2">
              <button className="w-full py-3 bg-surface-container-high border border-outline-variant/20 rounded-xl text-[10px] font-headline font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all">
                Return to Home
              </button>
              <button className="w-full py-3 bg-surface-container-high border border-outline-variant/20 rounded-xl text-[10px] font-headline font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all">
                Emergency Hover
              </button>
              <button className="w-full py-3 bg-surface-container-high border border-outline-variant/20 rounded-xl text-[10px] font-headline font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all">
                Drop Payload A
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
