import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Shield, Lock, User, ArrowRight, AlertCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Simulation */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/command/1920/1080?blur=10" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        <div className="absolute inset-0 scan-line opacity-20"></div>
      </div>

      {/* Top Left Telemetry */}
      <div className="absolute top-10 left-10 font-mono text-[10px] text-on-surface-variant opacity-50 space-y-1 hidden md:block">
        <p>LAT: 42.3601° N</p>
        <p>LON: 71.0589° W</p>
        <p>ALT: MSL 120M</p>
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel p-10 rounded-3xl border border-outline-variant/20 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 border border-primary/20 shadow-lg shadow-primary/10">
            <Rocket className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-headline font-bold tracking-widest text-on-surface uppercase">AEGIS COMMAND</h1>
          <p className="text-[10px] font-headline font-bold text-primary tracking-[0.3em] uppercase mt-2">Tactical Medical Response</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="space-y-2">
            <label className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest ml-1">Officer ID / Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Enter credentials"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Secure Access Key</label>
              <button type="button" className="text-[9px] font-headline font-bold text-primary uppercase tracking-widest hover:underline">Forgot Key?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="password" 
                placeholder="••••••••••••"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 px-1">
            <input type="checkbox" className="w-4 h-4 rounded border-outline-variant/30 bg-surface-container-low text-primary focus:ring-primary/20" id="persist" />
            <label htmlFor="persist" className="text-[10px] text-on-surface-variant font-medium">Maintain persistent session</label>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-on-primary font-headline font-bold text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Initialize Session
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-outline-variant/10 space-y-3">
          <p className="text-center text-[9px] font-headline font-bold text-on-surface-variant uppercase tracking-widest mb-4">Protocol Overrides</p>
          <button className="w-full py-3 border border-error/30 text-error font-headline font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-error/5 transition-all flex items-center justify-center gap-2">
            <AlertCircle className="w-3 h-3" />
            Emergency Access
          </button>
          <button className="w-full py-3 border border-outline-variant/20 text-on-surface-variant font-headline font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
            <HelpCircle className="w-3 h-3" />
            Contact Admin
          </button>
        </div>
      </motion.div>

      {/* Bottom Status */}
      <div className="absolute bottom-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">System Status: Orbital Link Active</span>
        </div>
        <div className="flex gap-6 text-[9px] font-mono text-on-surface-variant opacity-40 uppercase">
          <span>V4.8.2-Delta</span>
          <span>Encrypted AES-256</span>
        </div>
      </div>

      {/* Bottom Right HUD */}
      <div className="absolute bottom-10 right-10 font-mono text-[9px] text-on-surface-variant opacity-40 text-right space-y-1 hidden md:block">
        <p>THERMAL: NOMINAL</p>
        <p>SIGNAL: 98% CLEAR</p>
        <p>MODE: TACTICAL</p>
      </div>
    </div>
  );
}
