import React from 'react';
import { Card } from '../components/ui/Card';
import { AlertTriangle, Bell, Clock, Filter, Search, ShieldAlert, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const ALERTS = [
  { id: 1, type: 'critical', title: 'Flash Flood Warning', location: 'Sector 7-B', time: '14:22:01', description: 'Water levels exceeding 1.2m. Immediate evacuation of low-lying areas required.', status: 'active' },
  { id: 2, type: 'warning', title: 'High Wind Advisory', location: 'Zone Gamma', time: '14:15:30', description: 'Wind gusts up to 45 knots detected. Drone flight stability may be compromised.', status: 'active' },
  { id: 3, type: 'info', title: 'Path Recalculation', location: 'Drone-01', time: '14:10:12', description: 'Autonomous path update to avoid storm cell Alpha-9.', status: 'resolved' },
  { id: 4, type: 'critical', title: 'Victim Detected', location: 'Sector 4-C', time: '13:55:44', description: 'Thermal signature confirmed. Potential victim trapped in debris.', status: 'active' },
  { id: 5, type: 'warning', title: 'Battery Low', location: 'Drone-02', time: '13:45:20', description: 'Battery level at 15%. Returning to base for swap.', status: 'resolved' },
];

export function Alerts() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-widest">Alert Command Center</h2>
          <p className="text-[10px] font-headline font-bold text-primary tracking-[0.3em] uppercase mt-1">Real-time Threat Monitoring</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search alerts..."
              className="bg-surface-container-low border border-outline-variant/20 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-primary/50 transition-all w-64"
            />
          </div>
          <button className="p-2 bg-surface-container-high rounded-xl border border-outline-variant/20 text-on-surface-variant hover:text-primary transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Alert Stats */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="bg-error-container/5 border-error/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-error/10 rounded-lg text-error">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-headline font-bold text-error uppercase tracking-widest">Critical</p>
                <p className="text-2xl font-headline font-bold text-on-surface">02</p>
              </div>
            </div>
          </Card>
          <Card className="bg-tertiary/5 border-tertiary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-headline font-bold text-tertiary uppercase tracking-widest">Warnings</p>
                <p className="text-2xl font-headline font-bold text-on-surface">05</p>
              </div>
            </div>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-headline font-bold text-primary uppercase tracking-widest">Info</p>
                <p className="text-2xl font-headline font-bold text-on-surface">12</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Alert List */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {ALERTS.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-panel p-5 rounded-2xl border-l-4 flex items-start gap-5 group hover:bg-surface-container-high transition-all ${
                alert.type === 'critical' ? 'border-l-error' : 
                alert.type === 'warning' ? 'border-l-tertiary' : 
                'border-l-primary'
              }`}
            >
              <div className={`p-3 rounded-xl ${
                alert.type === 'critical' ? 'bg-error/10 text-error' : 
                alert.type === 'warning' ? 'bg-tertiary/10 text-tertiary' : 
                'bg-primary/10 text-primary'
              }`}>
                {alert.type === 'critical' ? <ShieldAlert className="w-6 h-6" /> : 
                 alert.type === 'warning' ? <AlertTriangle className="w-6 h-6" /> : 
                 <Bell className="w-6 h-6" />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-headline font-bold text-on-surface uppercase tracking-wider">{alert.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-mono text-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {alert.time}
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {alert.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                      alert.status === 'active' ? 'bg-error text-on-error animate-pulse' : 'bg-secondary/20 text-secondary'
                    }`}>
                      {alert.status}
                    </span>
                    <button className="p-1.5 hover:bg-surface-container-highest rounded-lg transition-colors text-on-surface-variant">
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl">
                  {alert.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
