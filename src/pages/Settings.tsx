import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Activity, 
  Cpu, 
  Database, 
  Wifi, 
  Battery, 
  Radio, 
  Navigation, 
  Eye, 
  Palette, 
  Layout, 
  Monitor, 
  Download, 
  Trash2, 
  LogOut, 
  Key, 
  RefreshCw, 
  FileJson,
  CheckCircle2,
  AlertCircle,
  Zap,
  Globe,
  Settings as SettingsIcon,
  Maximize2
} from 'lucide-react';
import { cn } from '../lib/utils';
import './Settings.css';

export function Settings() {
  const [activeTheme, setActiveTheme] = useState('tactical');
  const [accentColor, setAccentColor] = useState('#50b5ff');
  const [toggles, setToggles] = useState({
    animations: true,
    compactMode: false,
    glowEffects: true,
    gridOverlays: true,
    liveTelemetry: true
  });

  // Drone Sliders State
  const [altitude, setAltitude] = useState(120);
  const [speed, setSpeed] = useState(15);
  const [rthAltitude, setRthAltitude] = useState(30);

  // Apply Accent Color
  React.useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', accentColor);
    // Also update a secondary color derived from primary if needed
    document.documentElement.style.setProperty('--color-primary-container', accentColor + 'cc');
  }, [accentColor]);

  // Apply Theme Colors
  React.useEffect(() => {
    const themes: Record<string, { bg: string, surface: string, accent: string }> = {
      tactical: { bg: '#0a0e14', surface: '#0a0e14', accent: '#50b5ff' },
      neon: { bg: '#000814', surface: '#001a33', accent: '#00f2ff' },
      military: { bg: '#0d1109', surface: '#1a1f16', accent: '#6ffb85' }
    };
    
    const theme = themes[activeTheme];
    if (theme) {
      document.documentElement.style.setProperty('--color-background', theme.bg);
      document.documentElement.style.setProperty('--color-surface', theme.surface);
      if (activeTheme !== 'tactical') { // Let accent color override if not default
        // setAccentColor(theme.accent); 
      }
    }
  }, [activeTheme]);

  // Apply Animations Toggle
  React.useEffect(() => {
    if (!toggles.animations) {
      document.documentElement.classList.add('no-animations');
    } else {
      document.documentElement.classList.remove('no-animations');
    }
  }, [toggles.animations]);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-primary" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h1 className="text-3xl font-bold font-headline tracking-tighter uppercase">System Configuration</h1>
        </div>
        <p className="text-on-surface-variant text-sm font-mono tracking-widest uppercase opacity-70">
          Control Center / Node-01 / Settings
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Observer Profile */}
        <section className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors" style={{ backgroundColor: 'var(--color-primary)' }} />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-headline flex items-center gap-2">
              <User className="w-5 h-5 text-primary" style={{ color: 'var(--color-primary)' }} />
              OBSERVER PROFILE
            </h2>
            <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Online</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative group/avatar">
              <div className="w-24 h-24 rounded-2xl bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center overflow-hidden relative">
                <User className="w-12 h-12 text-on-surface-variant group-hover/avatar:text-primary transition-colors" />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-white animate-spin-slow" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter border-2 border-background" style={{ backgroundColor: 'var(--color-primary)' }}>
                OBSERVER
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Full Name</label>
                  <p className="font-medium text-on-surface">John "Specter" Doe</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Email Address</label>
                  <p className="font-medium text-on-surface">specter@drone-ops.mil</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Last Login</label>
                  <p className="font-mono text-sm text-on-surface-variant">2026-05-07 14:30:21 UTC</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Security Status</label>
                  <span className="text-[10px] font-bold text-primary flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                    <Shield className="w-3 h-3" /> ENCRYPTED SESSION
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-surface-container-highest hover:bg-surface-bright text-on-surface py-2 rounded-lg text-sm font-medium transition-all border border-outline-variant/30">
                  <Key className="w-4 h-4 text-primary" style={{ color: 'var(--color-primary)' }} />
                  Change Password
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error py-2 rounded-lg text-sm font-medium transition-all border border-error/20">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Drone Information */}
        <section className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary/40 group-hover:bg-secondary transition-colors" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-headline flex items-center gap-2">
              <Navigation className="w-5 h-5 text-secondary" />
              DRONE INFORMATION
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-on-surface-variant">ACTIVE NODE: DR-882-QX</span>
              <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(111,251,133,0.8)]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Model</label>
                  <p className="text-sm font-bold">RECON X-4</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Firmware</label>
                  <p className="text-sm font-mono">v4.2.8-stable</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Signal Strength</label>
                  <div className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-secondary" />
                    <p className="text-sm font-bold">-42 dBm</p>
                  </div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Battery Health</label>
                  <div className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-secondary" />
                    <p className="text-sm font-bold">98%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-on-surface-variant">Max Altitude</span>
                    <span className="text-secondary">{altitude}m</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="500"
                    value={altitude}
                    onChange={(e) => setAltitude(parseInt(e.target.value))}
                    className="w-full accent-secondary h-1 bg-surface-container-highest rounded-full appearance-none cursor-pointer" 
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-on-surface-variant">Max Speed</span>
                    <span className="text-secondary">{speed} m/s</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="30"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full accent-secondary h-1 bg-surface-container-highest rounded-full appearance-none cursor-pointer" 
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-on-surface-variant">RTH Altitude</span>
                    <span className="text-secondary">{rthAltitude}m</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="100"
                    value={rthAltitude}
                    onChange={(e) => setRthAltitude(parseInt(e.target.value))}
                    className="w-full accent-secondary h-1 bg-surface-container-highest rounded-full appearance-none cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-surface-container-highest/30 rounded-2xl border border-outline-variant/10 p-6 relative overflow-hidden group/drone">
              <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover/drone:opacity-100 transition-opacity" />
              <div className="relative">
                <Maximize2 className="absolute -top-12 -left-12 w-24 h-24 text-secondary/5" />
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3233/3233497.png" 
                  alt="Drone" 
                  className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(111,251,133,0.3)] group-hover/drone:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs font-mono text-secondary mb-1">SN: SN-882-QX-4</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Hardware Verified</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Dashboard Appearance */}
        <section className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-tertiary/40 group-hover:bg-tertiary transition-colors" />
          <h2 className="text-xl font-bold font-headline flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-tertiary" />
            DASHBOARD APPEARANCE
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-3">Theme Selection</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'tactical', label: 'Tactical Dark', color: '#0a0e14' },
                  { id: 'neon', label: 'Neon Blue', color: '#001a33' },
                  { id: 'military', label: 'Military Green', color: '#1a1f16' }
                ].map(theme => (
                  <button 
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                      activeTheme === theme.id 
                        ? "bg-tertiary/10 border-tertiary text-tertiary shadow-[0_0_10px_rgba(255,113,98,0.2)]" 
                        : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:border-tertiary/50"
                    )}
                  >
                    <div className="w-full h-8 rounded bg-background border border-outline-variant/20" style={{ backgroundColor: theme.color }} />
                    <span className="text-[10px] font-bold uppercase">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(toggles).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-on-surface-variant capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <button 
                    onClick={() => handleToggle(key as keyof typeof toggles)}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors duration-300",
                      value ? "bg-tertiary" : "bg-outline-variant/50"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                      value ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-3">Accent Color</label>
              <div className="flex gap-4">
                {['#50b5ff', '#6ffb85', '#ff7162', '#ffd93d', '#a855f7'].map(color => (
                  <button 
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                      accentColor === color ? "border-white scale-110 shadow-[0_0_10px_currentColor]" : "border-transparent"
                    )}
                    style={{ backgroundColor: color, color: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: System & Database */}
        <section className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors" style={{ backgroundColor: 'var(--color-primary)' }} />
          <h2 className="text-xl font-bold font-headline flex items-center gap-2 mb-6">
            <Database className="w-5 h-5 text-primary" style={{ color: 'var(--color-primary)' }} />
            SYSTEM & DATABASE
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" style={{ color: 'var(--color-primary)' }} />
                  <span className="text-xs font-medium">MongoDB</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-secondary uppercase">Connected</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                </div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" style={{ color: 'var(--color-primary)' }} />
                  <span className="text-xs font-medium">API Status</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-secondary uppercase">Active</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-highest/30">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-xs text-on-surface-variant">API Latency</span>
                </div>
                <span className="text-xs font-mono text-secondary">24ms</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-highest/30">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-xs text-on-surface-variant">Telemetry Records</span>
                </div>
                <span className="text-xs font-mono text-primary" style={{ color: 'var(--color-primary)' }}>1,248,392</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-surface-container-highest hover:bg-surface-bright border border-outline-variant/30 text-xs font-medium transition-all">
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-surface-container-highest hover:bg-surface-bright border border-outline-variant/30 text-xs font-medium transition-all">
                <Monitor className="w-4 h-4" /> Logs
              </button>
              <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-error/5 hover:bg-error/10 border border-error/20 text-error text-xs font-medium transition-all">
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>

            <div className="pt-4 border-t border-outline-variant/10">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-primary" style={{ color: 'var(--color-primary)' }} />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Health Monitor</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'CPU', val: '12%', color: 'secondary' },
                  { label: 'MEM', val: '4.2GB', color: 'secondary' },
                  { label: 'PING', val: '15ms', color: 'secondary' },
                  { label: 'NET', val: 'GOOD', color: 'secondary' }
                ].map(item => (
                  <div key={item.label} className="p-2 rounded bg-background border border-outline-variant/10 text-center">
                    <p className="text-[8px] font-bold text-on-surface-variant mb-1">{item.label}</p>
                    <p className="text-[10px] font-mono font-bold text-secondary">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
