
import React from 'react';
import { BotCard } from './BotCard';
import { Bot, WalletState, RadarSignal, DailySignal } from '../types';
import { 
  PlusCircleIcon, BriefcaseIcon, TrashIcon, GlobeIcon, WalletIcon, 
  ReceiptPercentIcon, BeakerIcon
} from './Icons';
import { CryptoRadar } from './CryptoRadar';
import { DailySignals } from './DailySignals';

const PortfolioSummary: React.FC<{ wallet: WalletState }> = ({ wallet }) => {
    const total = wallet.available + wallet.allocated + wallet.pending;
    
    return (
        <div className="glass-panel glow-border rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <WalletIcon className="h-40 w-40" />
            </div>
            
            <div className="relative z-10 flex items-center justify-between mb-10">
                <div className="flex items-center">
                    <div className="bg-cyan-500/20 p-3 rounded-2xl mr-4 ring-1 ring-cyan-500/30">
                        <BriefcaseIcon className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black font-space-grotesk tracking-tight text-white uppercase">Balance Engine</h2>
                      <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest">Protocol Version 3.4.A</span>
                    </div>
                </div>
                 <div className="text-right">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">AURA Balance</span>
                    <p className="text-xl font-mono font-black text-white">{wallet.auraBalance.toLocaleString()}</p>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-inner">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Liquid Funds</p>
                    </div>
                    <p className="text-2xl font-mono font-black text-white">${wallet.available.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-cyan-500" />
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">In Strategy</p>
                    </div>
                    <p className="text-2xl font-mono font-black text-cyan-400">${wallet.allocated.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">On-Chain Pending</p>
                    </div>
                    <p className="text-2xl font-mono font-black text-orange-400">${wallet.pending.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Master Node: <span className="text-cyan-400">SYNCED</span></span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Uptime: <span className="text-white">99.98%</span></span>
              </div>
              <p className="text-3xl font-mono font-black text-white tracking-tighter">${total.toLocaleString()}</p>
            </div>
        </div>
    );
};

interface DashboardProps {
  bots: Bot[];
  isAdmin: boolean;
  wallet: WalletState;
  radarSignals: RadarSignal[];
  dailySignals: DailySignal[];
  onToggleBotStatus: (botId: string) => void;
  onSyncWallet: (botId: string) => void;
  onWithdraw: () => void;
  onAnalyze: (bot: Bot) => void;
  onOpenChart: (pair: string) => void;
  onOpenCreateBotModal: () => void;
  onOpenAgentModal: (bot: Bot) => void;
  onOpenTradeLogModal: (bot: Bot) => void;
  onOpenApiKeysModal: () => void;
  onOpenWhitelistModal: () => void;
  onOpenTransactions: () => void;
  onOpenMonetization: () => void;
  onOpenBacktesting: () => void;
  onProtocolReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8"><PortfolioSummary wallet={props.wallet} /></div>
        <div className="lg:col-span-4">
            <DailySignals signals={props.dailySignals} />
        </div>
      </div>
      
      <CryptoRadar signals={props.radarSignals} />

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border-b border-slate-800 pb-6">
        <div>
            <div className="flex items-center space-x-2 text-cyan-500 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-black">AI Orchestration Hub</span>
            </div>
            <h2 className="text-5xl font-black font-space-grotesk text-white tracking-tighter uppercase italic">Agents</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button onClick={props.onOpenCreateBotModal} className="group relative bg-white text-slate-950 font-bold py-2.5 px-6 rounded-2xl transition-all hover:bg-cyan-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden text-xs uppercase tracking-widest">
            <span className="relative flex items-center"><PlusCircleIcon className="h-4 w-4 mr-2" /> Deploy Strategy</span>
          </button>
          
          <button onClick={props.onOpenBacktesting} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-5 rounded-2xl transition-all border border-slate-700 flex items-center text-xs uppercase tracking-widest">
            <BeakerIcon className="h-4 w-4 mr-2 text-purple-400" /> Strategy Playground
          </button>
          
          <button onClick={props.onWithdraw} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-5 rounded-2xl transition-all border border-slate-700 flex items-center text-xs uppercase tracking-widest">
            <GlobeIcon className="h-4 w-4 mr-2 text-cyan-400" /> Funds
          </button>
          
          <button onClick={props.onProtocolReset} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2.5 px-5 rounded-2xl transition-all border border-red-500/30 flex items-center text-xs uppercase tracking-widest">
            <TrashIcon className="h-4 w-4 mr-2" /> System Halt
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {props.bots.map(bot => (
          <BotCard
            key={bot.id}
            bot={bot}
            isAdmin={props.isAdmin}
            onToggleStatus={() => props.onToggleBotStatus(bot.id)}
            onSyncWallet={() => props.onSyncWallet(bot.id)}
            onAnalyze={() => props.onAnalyze(bot)}
            onOpenChart={() => props.onOpenChart(bot.pair)}
            onOpenAgentModal={() => props.onOpenAgentModal(bot)}
            onOpenTradeLogModal={() => props.onOpenTradeLogModal(bot)}
          />
        ))}
      </div>
    </div>
  );
};
