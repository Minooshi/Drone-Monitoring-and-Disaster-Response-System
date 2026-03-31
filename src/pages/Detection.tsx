import React from 'react';
import { Card } from '../components/ui/Card';
import { Users, Thermometer, Search, Target, AlertCircle, Scan, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const VICTIMS = [
  { id: 'VT-01', status: 'critical', temp: '34.2°C', confidence: '98%', location: 'Sector 7-B', time: '14:22:01' },
  { id: 'VT-02', status: 'stable', temp: '36.8°C', confidence: '92%', location: 'Sector 7-B', time: '14:20:15' },
  { id: 'VT-03', status: 'warning', temp: '35.5°C', confidence: '85%', location: 'Sector 4-C', time: '14:18:44' },
  { id: 'VT-04', status: 'stable', temp: '37.1°C', confidence: '99%', location: 'Sector 2-A', time: '14:15:30' },
];

export function Detection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-widest">Victim Detection</h2>
          <p className="text-[10px] font-headline font-bold text-primary tracking-[0.3em] uppercase mt-1">Multi-Spectral Thermal Analysis</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-primary/10 border border-primary/30 text-primary font-headline text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-all flex items-center gap-2">
            <Scan className="w-4 h-4" /> Recalibrate Sensors
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Thermal Feed */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="aspect-video bg-surface-container-low rounded-3xl relative overflow-hidden border border-outline-variant/10 shadow-2xl">
            <img 
              src="https://picsum.photos/seed/thermalscan/1280/720?grayscale" 
              alt="Thermal Scan" 
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-tertiary/10"></div>
            <div className="absolute inset-0 scan-line pointer-events-none opacity-40"></div>
            
            {/* Detection Markers */}
            <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2">
              <div className="w-24 h-24 border-2 border-error/60 rounded-lg relative animate-pulse">
                <div className="absolute -top-6 left-0 bg-error text-on-error text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">ID: VT-01 (CRITICAL)</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-6 h-6 text-error opacity-40" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-1/4 right-1/3 -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 border-2 border-secondary/60 rounded-lg relative">
                <div className="absolute -top-6 left-0 bg-secondary text-on-secondary text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">ID: VT-02 (STABLE)</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-6 h-6 text-secondary opacity-40" />
                </div>
              </div>
            </div>

            {/* HUD */}
            <div className="absolute bottom-8 left-8 glass-panel p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] text-on-surface-variant uppercase font-bold">Sensitivity</span>
                  <span className="text-xs font-mono text-primary">HIGH (0.02°C)</span>
                </div>
                <div className="w-px h-8 bg-outline-variant/20"></div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-on-surface-variant uppercase font-bold">Mode</span>
                  <span className="text-xs font-mono text-primary">HUMAN SIGNATURE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card title="Detection Confidence" icon={Target}>
              <div className="mt-4 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-on-surface-variant">Human Signature</span>
                    <span className="text-secondary">98.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[98.4%]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-on-surface-variant">Thermal Consistency</span>
                    <span className="text-primary">92.1%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[92.1%]"></div>
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Sensor Health" icon={Scan}>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-surface-container-high rounded-xl border border-outline-variant/10 text-center">
                  <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-1">Thermal Pod</p>
                  <p className="text-xs font-bold text-secondary uppercase">Nominal</p>
                </div>
                <div className="p-3 bg-surface-container-high rounded-xl border border-outline-variant/10 text-center">
                  <p className="text-[8px] text-on-surface-variant uppercase font-bold mb-1">Lidar Grid</p>
                  <p className="text-xs font-bold text-secondary uppercase">Active</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Victim List */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card title="Detected Subjects" icon={Users} className="h-[600px] flex flex-col">
            <div className="mt-4 space-y-3 overflow-y-auto flex-1 pr-2">
              {VICTIMS.map((victim) => (
                <div key={victim.id} className="p-4 bg-surface-container-high rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        victim.status === 'critical' ? 'bg-error/10 text-error' : 
                        victim.status === 'warning' ? 'bg-tertiary/10 text-tertiary' : 
                        'bg-secondary/10 text-secondary'
                      }`}>
                        <Thermometer className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-on-surface uppercase">{victim.id}</h4>
                        <span className="text-[9px] font-mono text-on-surface-variant">{victim.time}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                      victim.status === 'critical' ? 'bg-error text-on-error' : 
                      victim.status === 'warning' ? 'bg-tertiary text-on-tertiary' : 
                      'bg-secondary text-on-secondary'
                    }`}>
                      {victim.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-on-surface-variant uppercase font-bold">Temp</p>
                      <p className="text-xs font-mono text-on-surface">{victim.temp}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-on-surface-variant uppercase font-bold">Confidence</p>
                      <p className="text-xs font-mono text-on-surface">{victim.confidence}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                    <div className="flex items-center gap-2 text-[9px] text-on-surface-variant">
                      <MapPin className="w-3 h-3" />
                      {victim.location}
                    </div>
                    <button className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Details <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-4 mt-4 bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all">
              Deploy Rescue Team
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
