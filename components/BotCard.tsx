import React, { useState, useEffect, useRef } from 'react';
import { Bot, BotStatus, BotStrategy } from '../types';
import { 
  BrainCircuitIcon, BeakerIcon, ArrowDownTrayIcon, ChartBarIcon, 
  CpuChipIcon, ListBulletIcon, SparklesIcon, WalletIcon, GlobeIcon
} from './Icons';

interface BotCardProps {
  bot: Bot;
  isAdmin: boolean;
  onToggleStatus: () => void;
  onSyncWallet: () => void;
  onAnalyze: () => void;
  onOpenChart: () => void;
  onOpenAgentModal: () => void;
  onOpenTradeLogModal: () => void;
}

const strategyData: { [key in BotStrategy]: { icon: any; color: string; label: string } } = {
  [BotStrategy.GRID]: { icon: BeakerIcon, color: "text-purple-400", label: "QUANTRON GRID" },
  [BotStrategy.DCA]: { icon: ArrowDownTrayIcon, color: "text-blue-400", label: "VOLUMEX DCA" },
  [BotStrategy.AI_MOMENTUM]: { icon: BrainCircuitIcon, color: "text-cyan-400", label: "NEURAL MOMENTUM" },
};

const riskConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  'Low': { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30', label: 'CONSERVATIVE' },
  'Medium': { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', label: 'BALANCED' },
  'High': { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', label: 'AGGRESSIVE' },
};

export const BotCard: React.FC<BotCardProps> = ({ bot, ...props }) => {
  const [flashClass, setFlashClass] = useState('');
  const prevPnlRef = useRef(bot.pnl);

  const isRunning = bot.status === BotStatus.RUNNING;
  const pnlColor = bot.pnl >= 0 ? 'text-green-400' : 'text-red-400';
  const StrategyIcon = strategyData[bot.strategy].icon;
  const risk = riskConfig[bot.riskLevel];

  useEffect(() => {
    if (bot.pnl !== prevPnlRef.current) {
      const isUp = bot.pnl > prevPnlRef.current;
      setFlashClass(isUp ? 'animate-flash-green' : 'animate-flash-red');
      prevPnlRef.current = bot.pnl;
      
      const timer = setTimeout(() => setFlashClass(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [bot.pnl]);

  const timeAgo = bot.lastChainSync ? Math.floor((Date.now() - bot.lastChainSync) / 60000) : null;

  return (
    <div className="glass-panel rounded-[2rem] overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 group relative">
      <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-500 ${isRunning ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-700'}`} />
      
      <div className="p-6 border-b border-slate-800/50 flex justify-between items-start bg-slate-900/10">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h3 className="font-space-grotesk font-black text-2xl text-white tracking-tighter uppercase italic">{bot.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{bot.pair}</span>
            <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded border uppercase tracking-widest ${risk.color} ${risk.bg} ${risk.border}`}>
                {risk.label}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-2xl bg-slate-900 border border-slate-800 ${strategyData[bot.strategy].color} shadow-lg ring-1 ring-slate-700/50`}>
            <StrategyIcon className="h-6 w-6" />
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 shadow-inner group-hover:border-slate-700 transition-colors flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Live PNL</span>
            <span className={`text-2xl font-mono font-black whitespace-nowrap transition-all duration-300 ${flashClass || pnlColor}`}>
                {bot.pnl >= 0 ? '+' : ''}{bot.pnl.toFixed(2)} <span className="text-[10px] opacity-60">USDT</span>
            </span>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 group-hover:border-slate-700 transition-colors flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Win Rate</span>
            <span className={`text-2xl font-mono font-black whitespace-nowrap transition-all duration-300 ${isRunning ? 'text-cyan-400' : 'text-slate-500'}`}>
                {bot.winRate.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-3 bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Roll-up Sync</span>
                <span className="text-white flex items-center gap-1">
                    <GlobeIcon className={`h-3 w-3 ${isRunning ? 'text-green-400' : 'text-slate-600'}`} />
                    {timeAgo === null ? 'NEVER' : timeAgo === 0 ? 'JUST NOW' : `${timeAgo}M AGO`}
                </span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-1000" style={{ width: `${isRunning ? 100 : 0}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Efficiency Threshold</span>
                <span className="text-cyan-400">OPTIMIZED</span>
            </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
             <button onClick={props.onOpenAgentModal} className="h-10 w-10 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-md active:scale-95"><CpuChipIcon className="h-5 w-5" /></button>
             <button onClick={props.onOpenChart} className="h-10 w-10 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-md active:scale-95"><ChartBarIcon className="h-5 w-5" /></button>
             <button onClick={props.onOpenTradeLogModal} className="h-10 w-10 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-md active:scale-95"><ListBulletIcon className="h-5 w-5" /></button>
          </div>
          
          <div className="flex items-center space-x-3">
             <div className="text-right">
                <span className={`text-[8px] font-mono font-black block leading-none transition-colors duration-300 ${isRunning ? 'text-green-500' : 'text-slate-600'}`}>{isRunning ? 'EXECUTING' : 'IDLE'}</span>
                <span className="text-[10px] font-mono text-slate-500">{bot.totalTrades} OPS</span>
             </div>
             <button 
                onClick={props.onToggleStatus}
                className={`h-7 w-14 rounded-full relative transition-all duration-500 border ${isRunning ? 'bg-green-500/20 border-green-500/50' : 'bg-slate-900 border-slate-800'}`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-500 shadow-md ${isRunning ? 'right-1 bg-green-500 scale-110' : 'left-1 bg-slate-700'}`} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};