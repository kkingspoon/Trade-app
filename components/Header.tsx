import React, { useState } from 'react';
import { ShieldCheckIcon, GlobeIcon, BellIcon, Squares2X2Icon, LinkIcon, SparklesIcon } from './Icons';

interface HeaderProps {
  isSyncing: boolean;
  onSync: () => void;
  onOpenAlerts: () => void;
  alertCount: number;
  onOpenSecurityModal: () => void;
  onOpenPatternRecognition: () => void;
  connectedAccount: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

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
          <button 
            onClick={props.onSync} 
            disabled={props.isSyncing}
            className={`flex items-center space-x-3 text-[10px] font-mono py-2.5 px-5 rounded-2xl border transition-all ${
                props.isSyncing 
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' 
                : 'border-slate-800 text-slate-500 hover:border-slate-700 bg-slate-900/20'
            }`}
          >
            <SparklesIcon className={`h-4 w-4 ${props.isSyncing ? 'animate-spin' : ''}`} />
            <span className="tracking-widest font-black uppercase">
                {props.isSyncing ? 'Indexing Global Data...' : 'Sync Market Stream'}
            </span>
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <button 
            onClick={props.onOpenPatternRecognition}
            className="hidden sm:flex items-center px-5 py-2 rounded-2xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-purple-500/50 hover:text-purple-400 transition-all font-mono text-[10px] uppercase tracking-widest font-black"
        >
            <Squares2X2Icon className="h-4 w-4 mr-2" />
            Pattern Intel
        </button>
        
        <button 
            onClick={props.onOpenSecurityModal}
            className="hidden sm:flex items-center px-5 py-2 rounded-2xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all font-mono text-[10px] uppercase tracking-widest font-black"
        >
            <ShieldCheckIcon className="h-4 w-4 mr-2" />
            Security Ops
        </button>

        <button 
          onClick={props.onOpenAlerts}
          className="relative p-2.5 text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/40 rounded-2xl border border-slate-800"
        >
          <BellIcon className="h-5 w-5" />
          {props.alertCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-purple-600 text-[10px] text-white rounded-full flex items-center justify-center font-bold animate-bounce ring-2 ring-slate-900">
              {props.alertCount}
            </span>
          )}
        </button>

        {props.connectedAccount ? (
            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-2xl text-green-400 font-mono text-xs"
                >
                    {formatAddress(props.connectedAccount)}
                </button>
                {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-lg p-2 z-50">
                        <button
                            onClick={() => {
                                props.onDisconnectWallet();
                                setDropdownOpen(false);
                            }}
                            className="w-full text-left text-xs text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors flex items-center"
                        >
                           <LinkIcon className="h-4 w-4 mr-2 transform rotate-45"/> Disconnect
                        </button>
                    </div>
                )}
            </div>
        ) : (
            <button
                onClick={props.onConnectWallet}
                className="bg-white text-slate-950 font-bold py-2 px-6 rounded-2xl transition-all hover:bg-cyan-50 text-xs uppercase tracking-widest"
            >
                Connect Wallet
            </button>
        )}
      </div>
    </header>
  );
};