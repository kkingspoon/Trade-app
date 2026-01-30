
import React from 'react';
import { ShieldCheckIcon, GlobeIcon, BellIcon, Squares2X2Icon } from './Icons';

interface HeaderProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  isSyncing: boolean;
  onSync: () => void;
  onOpenAlerts: () => void;
  alertCount: number;
  masterWallet: string | null;
  onSyncWallet: () => void;
  onOpenPatternRecognition: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isAdmin, onToggleAdmin, isSyncing, onSync, onOpenAlerts, alertCount, masterWallet, onSyncWallet, onOpenPatternRecognition }) => {
  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-cyan-500/20 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <div className="flex flex-col">
          <h1 className="font-space-grotesk text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 leading-none italic">
            AURA ELITE
          </h1>
          <div className="flex items-center space-x-2 mt-1">
             <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
             <span className="text-[9px] font-mono text-cyan-500 font-black tracking-[0.3em] uppercase">Security Level 4</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-4">
          <button onClick={onSync} className={`flex items-center space-x-2 text-[10px] font-mono py-2 px-4 rounded-2xl border transition-all ${isSyncing ? 'border-cyan-500 text-cyan-400 animate-pulse' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}>
            <GlobeIcon className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="tracking-widest font-bold">{isSyncing ? 'PROTOCOL RE-INDEXING...' : 'LIVE MARKET STREAM'}</span>
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <button 
            onClick={onOpenPatternRecognition}
            className="hidden sm:flex items-center px-5 py-2 rounded-2xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-purple-500/50 hover:text-purple-400 transition-all font-mono text-[10px] uppercase tracking-widest font-black"
        >
            <Squares2X2Icon className="h-4 w-4 mr-2" />
            Pattern Intel
        </button>
        
        <button 
            onClick={onSyncWallet}
            className="hidden sm:flex items-center px-5 py-2 rounded-2xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all font-mono text-[10px] uppercase tracking-widest font-black"
        >
            <ShieldCheckIcon className="h-4 w-4 mr-2" />
            Security Ops
        </button>

        <button 
          onClick={onOpenAlerts}
          className="relative p-2.5 text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/40 rounded-2xl border border-slate-800"
        >
          <BellIcon className="h-5 w-5" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-purple-600 text-[10px] text-white rounded-full flex items-center justify-center font-bold animate-bounce ring-2 ring-slate-900">
              {alertCount}
            </span>
          )}
        </button>

        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button 
            onClick={onToggleAdmin}
            className={`h-8 w-14 rounded-xl relative transition-all duration-500 ${isAdmin ? 'bg-cyan-600 shadow-[0_0_20px_rgba(0,242,255,0.4)]' : 'bg-slate-800'}`}
          >
            <div className={`absolute top-1 bottom-1 w-6 rounded-lg bg-white transition-all duration-500 ${isAdmin ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>
      </div>
    </header>
  );
};
