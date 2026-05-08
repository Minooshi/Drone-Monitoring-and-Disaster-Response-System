import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { 
  AlertTriangle, 
  Plane, 
  Thermometer,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { useDrone } from '../lib/DroneContext';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const { status, toggleStatus } = useDrone();
  const [alertCount, setAlertCount] = useState<number>(0);
  const isInFlight = status === 'In Flight';

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAlertCount(data.length);
        }
      })
      .catch(err => console.error('Error fetching alerts:', err));
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RGB Camera Feed */}
        <Card title="RGB Live Stream" icon={Plane} subtitle="Drone-01_Alpha" className="p-0 overflow-hidden border-primary/20">
          <div className="relative aspect-video bg-black group">
            <img 
              src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200" 
              alt="RGB Feed"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 scan-line pointer-events-none"></div>
            
            {/* OSD (On-Screen Display) */}
            <div className="absolute top-4 left-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 bg-black/60 px-2 py-1 rounded border border-white/10">
                <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">REC ●</span>
              </div>
              <div className="bg-black/60 px-2 py-1 rounded border border-white/10 text-[9px] font-mono">
                ALT: 45.2m | SPD: 12.4m/s
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded border border-white/10 text-[9px] font-mono">
              LAT: 7.8731° N<br/>
              LON: 80.7718° E
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-8">
               {/* HUD Elements */}
               <div className="w-32 h-1 bg-white/20 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-primary shadow-[0_0_8px_#50b5ff]"></div>
               </div>
            </div>

            <div className="absolute inset-0 border-[20px] border-transparent border-t-white/5 border-b-white/5 pointer-events-none"></div>
          </div>
          <div className="p-4 bg-surface-container-low flex justify-between items-center">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase tracking-tighter border border-secondary/20">Signal: Optimal</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-tighter border border-primary/20">4K HDR</span>
            </div>
            <button className="text-[10px] font-bold uppercase text-on-surface-variant hover:text-primary transition-colors">Fullscreen</button>
          </div>
        </Card>

        {/* Thermal Camera Feed */}
        <Card title="Thermal Analytics" icon={Thermometer} subtitle="IR-Sensor v2.4" className="p-0 overflow-hidden border-tertiary/20">
          <div className="relative aspect-video bg-black group">
            <img 
              src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200" 
              alt="Thermal Feed"
              className="w-full h-full object-cover grayscale brightness-150 contrast-125 mix-blend-screen opacity-70 group-hover:opacity-90 transition-opacity"
            />
            {/* Heat Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-red-900/20 to-yellow-900/40 mix-blend-overlay"></div>
            <div className="absolute inset-0 scan-line pointer-events-none opacity-50"></div>
            
            {/* Thermal Markers */}
            <div className="absolute top-1/3 left-1/4 w-12 h-12 border border-tertiary/50 flex flex-col items-center justify-center">
              <div className="text-[8px] font-mono text-tertiary bg-black/80 px-1">37.2°C</div>
              <div className="w-1 h-1 bg-tertiary rounded-full"></div>
            </div>

            <div className="absolute bottom-1/4 right-1/3 w-8 h-8 border border-secondary/50 flex flex-col items-center justify-center">
              <div className="text-[8px] font-mono text-secondary bg-black/80 px-1">24.5°C</div>
              <div className="w-1 h-1 bg-secondary rounded-full"></div>
            </div>

            {/* Scale */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-32 bg-gradient-to-t from-blue-600 via-yellow-400 to-red-600 rounded-full border border-white/10 flex flex-col justify-between items-center py-2">
               <span className="text-[7px] font-bold">50</span>
               <span className="text-[7px] font-bold">0</span>
            </div>
          </div>
          <div className="p-4 bg-surface-container-low flex justify-between items-center">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded uppercase tracking-tighter border border-tertiary/20">Detected: Human Signature</span>
              <span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold rounded uppercase tracking-tighter border border-outline-variant/20">Range: 150m</span>
            </div>
            <button className="text-[10px] font-bold uppercase text-on-surface-variant hover:text-tertiary transition-colors">Export Map</button>
          </div>
        </Card>
      </div>

    </div>
  );
}


