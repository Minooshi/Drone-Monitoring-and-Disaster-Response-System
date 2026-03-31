import React from 'react';
import { Card } from '../components/ui/Card';
import { Layers, Search, Activity, Map as MapIcon, Database, Zap, AlertCircle, Scan } from 'lucide-react';
import { motion } from 'motion/react';

export function GPR() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-widest">Ground Penetrating Radar</h2>
          <p className="text-[10px] font-headline font-bold text-primary tracking-[0.3em] uppercase mt-1">Sub-Surface Structural Analysis</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-surface-container-high border border-outline-variant/20 text-on-surface font-headline text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-surface-container-highest transition-all flex items-center gap-2">
            <Layers className="w-4 h-4" /> Layer Filter
          </button>
          <button className="px-6 py-2.5 bg-primary text-on-primary font-headline text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2">
            <Scan className="w-4 h-4" /> Deep Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* GPR Visualization */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="aspect-video bg-surface-container-low rounded-3xl relative overflow-hidden border border-outline-variant/10 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
            
            {/* GPR Grid/Waveform Simulation */}
            <div className="absolute inset-0 flex flex-col justify-around p-10 opacity-40">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-px w-full bg-primary/30 relative">
                  <motion.div 
                    animate={{ 
                      x: ['0%', '100%'],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: i * 0.5,
                      ease: "linear"
                    }}
                    className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                </div>
              ))}
            </div>

            {/* Sub-surface Objects */}
            <div className="absolute top-1/2 left-1/3 w-32 h-16 bg-tertiary/20 border border-tertiary/40 rounded-full blur-md animate-pulse"></div>
            <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-error/10 border border-error/30 rounded-lg blur-sm"></div>

            {/* HUD */}
            <div className="absolute top-8 left-8 glass-panel p-4 rounded-2xl">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-8 text-[10px] font-mono">
                  <span className="text-on-surface-variant">DEPTH:</span>
                  <span className="text-primary">4.2M</span>
                </div>
                <div className="flex justify-between gap-8 text-[10px] font-mono">
                  <span className="text-on-surface-variant">DENSITY:</span>
                  <span className="text-primary">2.8 G/CM³</span>
                </div>
                <div className="flex justify-between gap-8 text-[10px] font-mono">
                  <span className="text-on-surface-variant">FREQ:</span>
                  <span className="text-primary">400 MHZ</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 glass-panel p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-headline font-bold text-on-surface uppercase tracking-widest">Signal Clarity: 94%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Card title="Soil Composition" icon={Database}>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-on-surface-variant">Silt/Clay</span>
                  <span className="text-on-surface">42%</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-on-surface-variant">Gravel</span>
                  <span className="text-on-surface">28%</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-on-surface-variant">Water Content</span>
                  <span className="text-tertiary">15%</span>
                </div>
              </div>
            </Card>
            <Card title="Anomalies" icon={AlertCircle}>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-on-surface-variant">Metallic</span>
                  <span className="text-secondary">02</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-on-surface-variant">Voids</span>
                  <span className="text-error">01</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-on-surface-variant">Structural</span>
                  <span className="text-on-surface">04</span>
                </div>
              </div>
            </Card>
            <Card title="Radar Pulse" icon={Zap}>
              <div className="mt-2 flex flex-col items-center">
                <div className="w-full h-12 flex items-end gap-1 px-2">
                  {[4, 7, 3, 8, 5, 9, 4, 6, 8, 3, 5].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/40 rounded-t-sm" style={{ height: `${h * 10}%` }}></div>
                  ))}
                </div>
                <span className="text-[8px] font-mono text-on-surface-variant mt-2">PULSE STRENGTH: NOMINAL</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Analysis Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card title="Structural Integrity" icon={Layers} className="h-[500px] flex flex-col">
            <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-2">
              <div className="p-4 bg-surface-container-high rounded-2xl border border-outline-variant/10">
                <h4 className="text-xs font-bold text-on-surface uppercase mb-2">Foundation Alpha</h4>
                <p className="text-[10px] text-on-surface-variant leading-relaxed mb-3">
                  Critical void detected at 2.4m depth. Structural stability compromised in Sector 4.
                </p>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-error/10 text-error text-[8px] font-bold rounded uppercase">Critical Risk</span>
                  <button className="text-[9px] font-bold text-primary uppercase tracking-widest">Analyze</button>
                </div>
              </div>
              <div className="p-4 bg-surface-container-high rounded-2xl border border-outline-variant/10">
                <h4 className="text-xs font-bold text-on-surface uppercase mb-2">Pipeline Gamma</h4>
                <p className="text-[10px] text-on-surface-variant leading-relaxed mb-3">
                  Metallic signature confirmed. Depth: 1.8m. Alignment matches utility blueprints.
                </p>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[8px] font-bold rounded uppercase">Stable</span>
                  <button className="text-[9px] font-bold text-primary uppercase tracking-widest">Analyze</button>
                </div>
              </div>
            </div>
            
            <button className="w-full py-4 mt-4 bg-surface-container-highest text-on-surface font-headline font-bold text-xs uppercase tracking-widest rounded-xl border border-outline-variant/20 hover:bg-surface-container-high transition-all">
              Export GPR Data
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
