import React, { useState, useEffect } from 'react';
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
  Maximize2,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

export function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTheme, setActiveTheme] = useState('tactical');
  const [accentColor, setAccentColor] = useState('#50b5ff');
  const [userData, setUserData] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });

  // Drone Sliders State
  const [altitude, setAltitude] = useState(120);
  const [speed, setSpeed] = useState(15);
  const [rthAltitude, setRthAltitude] = useState(30);

  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error('Error fetching profile:', err));
  }, []);

  // Apply Accent Color
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', accentColor);
    document.documentElement.style.setProperty('--color-primary-container', accentColor + 'cc');
  }, [accentColor]);

  // Apply Theme Colors
  useEffect(() => {
    const themes: Record<string, { bg: string, surface: string }> = {
      tactical: { bg: '#0a0e14', surface: '#0f172a' },
      neon: { bg: '#000814', surface: '#001a33' },
      military: { bg: '#0d1109', surface: '#1a1f16' }
    };

    const selected = themes[activeTheme];
    if (selected) {
      // Only apply these backgrounds if we are in dark mode (optional, but usually these "themes" are dark-centric)
      // The user wants them active for both, so we'll apply them to specific variables used by cards/inputs.
      document.documentElement.style.setProperty('--color-theme-bg', selected.bg);
      document.documentElement.style.setProperty('--color-theme-surface', selected.surface);
    }
  }, [activeTheme]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new
        })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordStatus({ type: 'success', message: 'Password updated successfully' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordForm({ current: '', new: '', confirm: '' });
          setPasswordStatus({ type: '', message: '' });
        }, 2000);
      } else {
        setPasswordStatus({ type: 'error', message: data.message });
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', message: 'Server error' });
    }
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
              <div className="w-24 h-24 rounded-2xl bg-surface-container-highest/20 border-2 border-outline-variant flex items-center justify-center overflow-hidden relative">
                <User className="w-12 h-12 text-on-surface-variant group-hover/avatar:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-white animate-spin-slow" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter border-2 border-background" style={{ backgroundColor: 'var(--color-primary)' }}>
                {userData?.role || 'OBSERVER'}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Full Name</label>
                  <p className="font-medium text-on-surface">{userData?.name || '...'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Email Address</label>
                  <p className="font-medium text-on-surface">{userData?.email || '...'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Last Login</label>
                  <p className="font-mono text-sm text-on-surface-variant">
                    {userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : '...'}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Security Status</label>
                  <span className="text-[10px] font-bold text-primary flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                    <Shield className="w-3 h-3" /> ENCRYPTED SESSION
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-surface-container-highest/30 hover:bg-surface-bright text-on-surface py-2 rounded-lg text-sm font-medium transition-all border border-outline-variant/30"
                >
                  <Key className="w-4 h-4 text-primary" style={{ color: 'var(--color-primary)' }} />
                  Change Password
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="flex-1 flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error py-2 rounded-lg text-sm font-medium transition-all border border-error/20"
                >
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

            <div className="flex items-end justify-between pt-2">
              <div className="flex-1">
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

              <button 
                onClick={toggleTheme}
                className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:bg-surface-bright transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                {theme === 'dark' ? (
                  <Sun className="w-8 h-8 text-yellow-400 animate-pulse" />
                ) : (
                  <Moon className="w-8 h-8 text-primary animate-bounce-slow" />
                )}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              </button>
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-outline-variant/20 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold uppercase tracking-widest">Update Security Key</h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 hover:bg-surface-container rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Current Password</label>
                <input 
                  type="password" 
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              {passwordStatus.message && (
                <div className={cn(
                  "p-3 rounded-lg text-xs font-medium flex items-center gap-2",
                  passwordStatus.type === 'success' ? "bg-secondary/10 text-secondary border border-secondary/20" : "bg-error/10 text-error border border-error/20"
                )}>
                  {passwordStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {passwordStatus.message}
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-4 bg-primary text-on-primary font-headline font-bold text-sm uppercase tracking-widest rounded-xl hover:brightness-110 transition-all mt-4"
              >
                Apply Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

