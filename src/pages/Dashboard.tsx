import React from 'react';
import { Card } from '../components/ui/Card';
import { 
  AlertTriangle, 
  Plane, 
  Users, 
  TrendingUp, 
  Battery,
  MapPin,
  Clock,
  ChevronRight,
  Thermometer
} from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card title="Active Alerts" icon={AlertTriangle}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-headline font-bold text-tertiary">07</span>
            <AlertTriangle className="w-5 h-5 text-tertiary animate-pulse" />
          </div>
        </Card>
        <Card title="Drone Status" icon={Plane} className="border-l-2 border-primary">
          <div className="mt-2">
            <span className="text-2xl font-headline font-bold text-primary block">In Flight</span>
            <Plane className="w-5 h-5 text-primary mt-1" />
          </div>
        </Card>
        <Card title="Victims Detected" icon={Users}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-headline font-bold text-secondary">24</span>
            <Users className="w-5 h-5 text-secondary" />
          </div>
        </Card>
        <Card title="Success Rate" icon={TrendingUp}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-headline font-bold text-on-surface">92<span className="text-lg">%</span></span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </Card>
        <Card title="Battery" icon={Battery}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-headline font-bold text-secondary">84<span className="text-lg">%</span></span>
            <Battery className="w-5 h-5 text-secondary" />
          </div>
          <div className="mt-2 h-1 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-[84%]"></div>
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

      <div className="grid grid-cols-12 gap-6">
        {/* Map View (Moved below videos) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl relative overflow-hidden border border-outline-variant/10 h-[400px]">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-g_CHPnMZzzRxuYeOBbAob9YX7xCLuTKIIg4dcpHeh-JaDiOD1WHcx4tBJnNhDR7Urrv_gUIAOEIzGabdyqbe7fOI9T_NgAp_g0O0U9DvwSRKnwYMCrfirsYQndyXSEB31nyWJVpc_hXhkwVcTwZxesG66zWQLZWlVUBo0gBKzuJ6sKcXZMXYkUtXrS3NdBtEc-gTxKdKbJ_xO0QXEj3BXPJ9EtDKOz6WZjUJemwUeRVZ5xKmY6o40Zoa9IoNYZErhQ8jxUS5JI4" 
            alt="Map"
            className="w-full h-full object-cover opacity-40 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 scan-line pointer-events-none"></div>
          
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="glass-panel px-3 py-1.5 rounded-lg text-[9px] font-mono">
              7.8731° N, 80.7718° E
            </div>
          </div>

          {/* Drone Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary flex items-center justify-center animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <button className="px-4 py-2 bg-primary/90 text-on-primary font-headline text-[10px] font-bold uppercase tracking-widest rounded-lg hover:brightness-110 transition-all">
              Update Flight Path
            </button>
          </div>
        </div>

        {/* Alerts & Timeline */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card title="System Alerts" subtitle="REAL-TIME" icon={Clock} className="h-full min-h-[400px] flex flex-col">
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
              <div className="p-3 bg-error-container/10 border-l-2 border-error rounded-r-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-error uppercase">Heat Signature Detected</span>
                  <span className="text-[9px] font-mono text-on-surface-variant">14:22:01</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Possible victim identified at Sector 7-B. Thermal lock acquired.
                </p>
              </div>
              <div className="p-3 bg-primary/10 border-l-2 border-primary rounded-r-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase">Auto-Stabilization</span>
                  <span className="text-[9px] font-mono text-on-surface-variant">14:18:45</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Compensating for 15KT crosswinds. Signal strength: 98%.
                </p>
              </div>
              <div className="p-3 bg-secondary/10 border-l-2 border-secondary rounded-r-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-secondary uppercase">Area Scanned</span>
                  <span className="text-[9px] font-mono text-on-surface-variant">14:15:30</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  85% of designated search area completed. No anomalies.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Mission Timeline */}
      <Card title="Mission Timeline" className="mt-6">
        <div className="relative pl-6 border-l border-outline-variant/20 space-y-6">
          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_#6ffb85]"></div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase">Drone Deployed</h4>
                <p className="text-[10px] text-on-surface-variant mt-1">Primary launch successful from Base Delta.</p>
              </div>
              <span className="text-[9px] font-mono text-on-surface-variant">13:40</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_#50b5ff]"></div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase">Scan Initiated</h4>
                <p className="text-[10px] text-on-surface-variant mt-1">Multi-spectral imaging operational.</p>
              </div>
              <span className="text-[9px] font-mono text-on-surface-variant">13:55</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
