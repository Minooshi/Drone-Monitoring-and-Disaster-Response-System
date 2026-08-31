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
        className="cursor-pointer group relative block focus:outline-none max-w-5xl"
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
          <div className="px-4 py-2.5 bg-surface-container-low/90 backdrop-blur-md border-b border-outline-variant/20 flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[11px] font-mono">
                <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                <span className="font-bold uppercase tracking-wider text-white">IR LIVE FEED</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary border border-tertiary/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                ● 192.168.8.200
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-primary font-bold text-[11px] hidden sm:inline">AI MODEL: YOLO-IR v4.2</span>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-primary/20 group-hover:bg-primary text-primary group-hover:text-black font-headline font-bold rounded-lg text-[11px] tracking-wider uppercase transition-all duration-300 shadow-md">
                <span>Open Thermal Feed</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Interactive Screen Viewport - Reduced Length/Height */}
          <div className="relative h-56 sm:h-64 md:h-72 w-full bg-black overflow-hidden select-none">
            {/* Background Thermal Video */}
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
            >
              <source src="/thermalvdo.mp4" type="video/mp4" />
              <source src="/thermalvdo.mp4.mp4" type="video/mp4" />
            </video>

            {/* Subtle Infrared Heat Overlay & Scanlines */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/30 via-transparent to-amber-500/15 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 scan-line pointer-events-none opacity-25"></div>

            {/* Corner HUD Brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary group-hover:scale-110 transition-transform pointer-events-none"></div>
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary group-hover:scale-110 transition-transform pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary group-hover:scale-110 transition-transform pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary group-hover:scale-110 transition-transform pointer-events-none"></div>

            {/* Telemetry OSD Bottom-Left */}
            <div className="absolute bottom-3 left-4 flex flex-col gap-0.5 bg-black/75 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-[8px] font-mono pointer-events-none">
              <div className="text-white font-bold flex items-center gap-1">
                <Crosshair className="w-3 h-3 text-primary" />
                <span>FLIR LWIR ACTIVE (192.168.8.200)</span>
              </div>
              <div className="text-on-surface-variant text-[7.5px]">
                LAT: 7.8742° N | LON: 80.7731° E | ALT: 48.6m
              </div>
            </div>

            {/* Thermal Palette Scale Right */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-black/75 backdrop-blur-md p-1 rounded-md border border-white/10 pointer-events-none">
              <div className="w-2 h-16 bg-gradient-to-t from-blue-600 via-yellow-400 to-red-600 rounded-full"></div>
              <div className="flex flex-col justify-between text-[6.5px] font-mono text-white h-16 font-bold">
                <span>50°</span>
                <span>37°</span>
                <span>15°</span>
              </div>
            </div>

            {/* Button Centered Directly in Front of Video */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-5 py-2.5 rounded-xl bg-surface-container/90 hover:bg-surface-container-highest/95 border border-primary/50 text-white font-headline text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-2xl shadow-primary/30 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-[0_0_25px_rgba(80,181,255,0.45)]">
                <ScanFace className="w-4 h-4 text-primary animate-pulse" />
                <span>OPEN THERMAL FEED</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card Bottom Quick Summary Bar */}
          <div className="px-4 py-2.5 bg-surface-container-low flex flex-wrap justify-between items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[9px] font-bold rounded uppercase tracking-wider border border-secondary/20 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-secondary animate-ping"></span>
                AI Multi-Target Tracker
              </span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded uppercase tracking-wider border border-primary/20">
                8–14 µm LWIR
              </span>
              <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[9px] font-bold rounded uppercase tracking-wider border border-tertiary/20">
                192.168.8.200
              </span>
            </div>
            <div className="text-[10px] font-mono font-bold text-primary group-hover:text-white flex items-center gap-1 transition-colors">
              <span>Open in New Tab</span>
              <span>↗</span>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
