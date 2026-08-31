import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { 
  AlertTriangle, 
  Plane, 
  Thermometer, 
  LogOut,
  ScanFace,
  ArrowUpRight,
  Crosshair,
  Sparkles,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { useDrone } from '../lib/DroneContext';
import { useNavigate } from 'react-router-dom';

import { fetchPartnerMapData } from '../lib/partnerApi';

export function Dashboard() {
  const navigate = useNavigate();
  const { status, toggleStatus } = useDrone();
  const [alertCount, setAlertCount] = useState<number>(0);
  const isInFlight = status === 'In Flight';

  useEffect(() => {
    fetchPartnerMapData()
      .then(res => {
        if (res.data) {
          const total = (res.data.mountains?.length || 0) + (res.data.devices?.length || 0);
          setAlertCount(total);
        }
      })
      .catch(err => console.error('Error fetching partner alerts:', err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-widest">Tactical Command</h2>
          <p className="text-[10px] font-headline font-bold text-primary tracking-[0.3em] uppercase mt-1">Operational Overview</p>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-4 py-2 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-error/5 group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <Card title="Active Alerts" icon={AlertTriangle}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-headline font-bold text-tertiary">
              {alertCount.toString().padStart(2, '0')}
            </span>
            <AlertTriangle className="w-5 h-5 text-tertiary animate-pulse" />
          </div>
        </Card>
        <Card 
          title="Drone Status" 
          icon={Plane} 
          className={clsx(
            "border-l-2 transition-colors duration-500",
            isInFlight ? "border-primary" : "border-error"
          )}
        >
          <div className="mt-2 space-y-4">
            <div className="flex justify-between items-end">
              <span className={clsx(
                "text-2xl font-headline font-bold transition-colors duration-300",
                isInFlight ? "text-primary" : "text-error"
              )}>
                {status}
              </span>
              <Plane className={clsx(
                "w-5 h-5 transition-all duration-500",
                isInFlight ? "text-primary" : "text-error rotate-180 opacity-50"
              )} />
            </div>
            
            {/* Interactive Status Line / Toggle */}
            <div 
              className="relative h-8 bg-surface-container rounded-lg border border-outline-variant/10 cursor-pointer overflow-hidden group"
              onClick={toggleStatus}
            >
              <div className="absolute inset-0 flex">
                <div className="flex-1 flex items-center justify-center text-[9px] font-bold uppercase tracking-widest z-10 text-on-surface/50">
                  In Flight
                </div>
                <div className="flex-1 flex items-center justify-center text-[9px] font-bold uppercase tracking-widest z-10 text-on-surface/50">
                  Grounded
                </div>
              </div>
              
              <motion.div 
                className={clsx(
                  "absolute inset-y-1 w-[calc(50%-4px)] rounded-md shadow-lg z-0",
                  isInFlight ? "bg-primary" : "bg-error"
                )}
                animate={{ x: isInFlight ? 4 : '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              
              {/* Hover highlight line */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 w-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Clickable Thermal Human Detection Screen Monitor */}
      <div 
        onClick={() => window.open('http://192.168.8.200', '_blank', 'noopener,noreferrer')}
        className="cursor-pointer group relative block focus:outline-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') window.open('http://192.168.8.200', '_blank', 'noopener,noreferrer'); }}
      >
        <Card 
          title="Thermal Human Detection" 
          icon={ScanFace} 
          subtitle="FLIR Boson 640 LWIR • IP: 192.168.8.200 • Click to Open Stream" 
          className="p-0 overflow-hidden border-primary/30 group-hover:border-primary transition-all duration-500 shadow-xl group-hover:shadow-[0_0_30px_rgba(80,181,255,0.2)] relative"
        >
          {/* Top Live Banner Bar */}
          <div className="px-5 py-3 bg-surface-container-low/90 backdrop-blur-md border-b border-outline-variant/20 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 border border-white/10 text-xs font-mono">
                <div className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></div>
                <span className="font-bold uppercase tracking-wider text-white">IR LIVE FEED</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary border border-tertiary/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                ● 192.168.8.200
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-primary font-bold hidden sm:inline">AI MODEL: YOLO-IR v4.2</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/20 group-hover:bg-primary text-primary group-hover:text-black font-headline font-bold rounded-lg text-xs tracking-wider uppercase transition-all duration-300 shadow-md">
                <span>Open Thermal Feed</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Interactive Screen Viewport */}
          <div className="relative aspect-[21/9] sm:aspect-[21/8] bg-black overflow-hidden select-none">
            {/* Base Thermal Image */}
            <img 
              src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1600" 
              alt="Thermal Human Detection Feed"
              className="w-full h-full object-cover grayscale brightness-125 contrast-150 mix-blend-screen opacity-75 group-hover:opacity-95 group-hover:scale-[1.01] transition-all duration-700"
            />
            {/* Dynamic Infrared Ironbow Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/70 via-red-950/40 to-amber-500/50 mix-blend-overlay"></div>
            <div className="absolute inset-0 scan-line pointer-events-none opacity-40"></div>

            {/* Corner HUD Brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary group-hover:scale-110 transition-transform"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary group-hover:scale-110 transition-transform"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary group-hover:scale-110 transition-transform"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary group-hover:scale-110 transition-transform"></div>

            {/* Simulated Reticle & Horizon HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-40 h-40 border border-white/10 rounded-full flex items-center justify-center group-hover:border-primary/40 transition-colors">
                <div className="w-16 h-0.5 bg-primary/30 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-primary rounded-full group-hover:scale-125 transition-transform"></div>
                </div>
              </div>
            </div>

            {/* Simulated Live Detection Boxes */}
            {/* Target 1 */}
            <div className="absolute top-[30%] left-[25%] w-[12%] h-[40%] border-2 border-tertiary bg-tertiary/10 rounded-sm shadow-[0_0_12px_rgba(255,113,98,0.4)] flex flex-col justify-between p-1">
              <div className="bg-tertiary text-black text-[8px] font-mono font-bold px-1 rounded-sm w-max -mt-5 whitespace-nowrap">
                HUM-01 | 34.2°C (98%)
              </div>
              <div className="text-[7px] font-mono text-tertiary bg-black/80 px-1 rounded w-max">
                HYPOTHERMIA
              </div>
            </div>

            {/* Target 2 */}
            <div className="absolute top-[38%] left-[58%] w-[10%] h-[35%] border-2 border-secondary bg-secondary/10 rounded-sm shadow-[0_0_12px_rgba(111,251,133,0.4)] flex flex-col justify-between p-1">
              <div className="bg-black/90 border border-secondary text-secondary text-[8px] font-mono font-bold px-1 rounded-sm w-max -mt-5 whitespace-nowrap">
                HUM-02 | 36.8°C (94%)
              </div>
              <div className="text-[7px] font-mono text-secondary bg-black/80 px-1 rounded w-max">
                STABLE
              </div>
            </div>

            {/* Target 3 */}
            <div className="absolute top-[28%] left-[75%] w-[11%] h-[38%] border-2 border-primary bg-primary/10 rounded-sm shadow-[0_0_12px_rgba(80,181,255,0.4)] flex flex-col justify-between p-1">
              <div className="bg-black/90 border border-primary text-primary text-[8px] font-mono font-bold px-1 rounded-sm w-max -mt-5 whitespace-nowrap">
                HUM-03 | 38.6°C (98%)
              </div>
              <div className="text-[7px] font-mono text-primary bg-black/80 px-1 rounded w-max">
                ELEVATED
              </div>
            </div>

            {/* Telemetry OSD Bottom-Left */}
            <div className="absolute bottom-4 left-6 flex flex-col gap-1 bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[9px] font-mono">
              <div className="text-white font-bold flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-primary" />
                <span>FLIR LWIR SENSOR ACTIVE (192.168.8.200)</span>
              </div>
              <div className="text-on-surface-variant">
                LAT: 7.8742° N | LON: 80.7731° E | ALT: 48.6m
              </div>
            </div>

            {/* Thermal Palette Scale Right */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
              <div className="w-2.5 h-24 bg-gradient-to-t from-blue-600 via-yellow-400 to-red-600 rounded-full"></div>
              <div className="flex flex-col justify-between text-[7px] font-mono text-white h-24 font-bold">
                <span>50°</span>
                <span>37°</span>
                <span>15°</span>
              </div>
            </div>

            {/* Hover Action Center Callout Overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="px-5 py-3 rounded-2xl bg-surface-container/90 border border-primary/50 text-white font-headline text-sm font-bold uppercase tracking-wider flex items-center gap-3 shadow-2xl shadow-primary/20 transform group-hover:scale-105 transition-transform">
                <ScanFace className="w-5 h-5 text-primary animate-pulse" />
                <span>Open Thermal Feed (192.168.8.200)</span>
                <ArrowUpRight className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Card Bottom Quick Summary Bar */}
          <div className="p-4 bg-surface-container-low flex flex-wrap justify-between items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-lg uppercase tracking-wider border border-secondary/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                AI Multi-Target Tracker
              </span>
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg uppercase tracking-wider border border-primary/20">
                Spectrum: 8–14 µm LWIR
              </span>
              <span className="px-2.5 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded-lg uppercase tracking-wider border border-tertiary/20">
                Host: 192.168.8.200
              </span>
            </div>
            <div className="text-xs font-mono font-bold text-primary group-hover:text-white flex items-center gap-1 transition-colors">
              <span>Open in New Tab</span>
              <span>↗</span>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
