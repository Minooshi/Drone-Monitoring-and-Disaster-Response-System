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

      <div className="grid grid-cols-12 gap-6">
        {/* Map View */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl relative overflow-hidden border border-outline-variant/10 h-[500px]">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-g_CHPnMZzzRxuYeOBbAob9YX7xCLuTKIIg4dcpHeh-JaDiOD1WHcx4tBJnNhDR7Urrv_gUIAOEIzGabdyqbe7fOI9T_NgAp_g0O0U9DvwSRKnwYMCrfirsYQndyXSEB31nyWJVpc_hXhkwVcTwZxesG66zWQLZWlVUBo0gBKzuJ6sKcXZMXYkUtXrS3NdBtEc-gTxKdKbJ_xO0QXEj3BXPJ9EtDKOz6WZjUJemwUeRVZ5xKmY6o40Zoa9IoNYZErhQ8jxUS5JI4" 
            alt="Map"
            className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 scan-line pointer-events-none"></div>
          
          {/* Map Overlays */}
          <div className="absolute top-6 left-6 space-y-2">
            <div className="glass-panel px-4 py-2 rounded-lg text-[10px] font-mono">
              COORDS: 7.8731° N, 80.7718° E
            </div>
            <div className="glass-panel px-4 py-2 rounded-lg text-[10px] font-mono">
              WIND: 12KT NW
            </div>
          </div>

          {/* Drone Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            <span className="mt-2 px-2 py-0.5 bg-primary/80 text-on-primary text-[8px] font-bold rounded uppercase">Drone-01_Alpha</span>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-6 left-6 glass-panel p-4 rounded-xl w-48">
            <h4 className="text-[10px] font-headline font-bold uppercase tracking-widest mb-3">Map Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                <span>High Risk Flood Zone</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Active Flight Path</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span>Victim Cluster</span>
              </div>
            </div>
          </div>

          {/* Map Actions */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button className="px-6 py-2.5 bg-primary text-on-primary font-headline text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all">
              Launch Mission
            </button>
            <button className="px-6 py-2.5 bg-surface-container-highest text-on-surface font-headline text-xs font-bold uppercase tracking-widest rounded-xl border border-outline-variant/20">
              View Live Feed
            </button>
          </div>
        </div>

        {/* Right Column: Alerts & Thermal */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card title="Recent Alerts" subtitle="LIVE" icon={Clock} className="h-[240px] flex flex-col">
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
              <div className="p-3 bg-error-container/10 border-l-2 border-error rounded-r-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-error uppercase">Critical Flood</span>
                  <span className="text-[9px] font-mono text-on-surface-variant">14:22:01</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Sector 7-B Water levels exceeding 1.2m. Evacuation required.
                </p>
              </div>
              <div className="p-3 bg-primary/10 border-l-2 border-primary rounded-r-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase">Path Updated</span>
                  <span className="text-[9px] font-mono text-on-surface-variant">14:18:45</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Drone 01 recalculated path to avoid high-wind zone Gamma.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Thermal Scan" icon={Thermometer} className="h-[240px]">
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video bg-surface-container-highest rounded-lg overflow-hidden border border-outline-variant/10 relative group cursor-pointer">
                  <img 
                    src={`https://picsum.photos/seed/thermal${i}/200/120`} 
                    alt="Thermal" 
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-mono">ID: VT-0{i}</div>
                </div>
              ))}
              <div className="aspect-video bg-surface-container-highest rounded-lg border border-dashed border-outline-variant/30 flex items-center justify-center">
                <span className="text-[8px] font-mono text-on-surface-variant animate-pulse">SCANNING...</span>
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
