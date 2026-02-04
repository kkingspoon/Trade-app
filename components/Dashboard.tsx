import React from 'react';
import { BotCard } from './BotCard';
import { Bot, WalletState, RadarSignal, DailySignal, PortfolioMetrics } from '../types';
import { 
  PlusCircleIcon, BriefcaseIcon, TrashIcon, GlobeIcon, WalletIcon, 
  ReceiptPercentIcon, BeakerIcon, GiftIcon, SparklesIcon, CpuChipIcon
} from './Icons';
import { CryptoRadar } from './CryptoRadar';
import { DailySignals } from './DailySignals';

const PortfolioSummary: React.FC<{ 
    wallet: WalletState, 
    metrics: PortfolioMetrics, 
    connectedAccount: string | null,
    isSyncing: boolean,
    onSync: () => void
}> = ({ wallet, metrics, connectedAccount, isSyncing, onSync }) => {
    const total = wallet.available + wallet.allocated + wallet.pending;
    
    return (
        <div className="glass-panel glow-border rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CpuChipIcon className="h-40 w-40 text-cyan-400" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center">
                    <div className="bg-purple-600/20 p-3 rounded-2xl mr-4 ring-1 ring-purple-500/30">
                        <BriefcaseIcon className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black font-space-grotesk tracking-tight text-white uppercase italic">Roll-up Node</h2>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest block mt-0.5">
                        {connectedAccount ? `Owner: ${connectedAccount.slice(0, 8)}...` : 'Sandbox Environment'}
                      </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="text-[10px] font-mono text-green-400 font-bold uppercase tracking-widest block">Portfolio Win Rate</span>
                        <p className="text-3xl font-mono font-black text-white">{metrics.totalWinRate.toFixed(1)}%</p>
                    </div>
                    
                    <button 
                        onClick={onSync}
                        disabled={isSyncing || !connectedAccount}
                        className={`px-6 py-2.5 rounded-2xl border font-mono text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            isSyncing ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 
                            'border-slate-800 text-slate-400 hover:border-purple-500/50 hover:text-purple-400 bg-slate-900/40'
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                        {isSyncing ? (
                            <><SparklesIcon className="h-4 w-4 animate-spin" /> Merging Proofs...</>
                        ) : (
                            <><GlobeIcon className="h-4 w-4" /> Merge to Chain</>
                        )}
                    </button>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800 shadow-inner">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Active Layers</p>
                    <p className="text-xl font-mono font-black text-white">{metrics.activeNodes} Nodes</p>
                </div>
                <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Rollup State</p>
                    <p className="text-xl font-mono font-black text-purple-400 uppercase">{metrics.lastRollupHash}</p>
                </div>
                <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Block Height</p>
                    <p className="text-xl font-mono font-black text-cyan-400">{metrics.blockHeight.toLocaleString()}</p>
                </div>
                <div className="bg-slate-950/60 p-5 rounded-3xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Equity</p>
                    <p className="text-xl font-mono font-black text-white">${total.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Liquid Portfolio</span>
                    <span className="text-sm font-mono font-black text-white">${wallet.available.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Locked Rollup</span>
                    <span className="text-sm font-mono font-black text-purple-400">${wallet.allocated.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                 <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Aura Governance: </span>
                 <span className="text-xs font-mono font-black text-white">{wallet.auraBalance.toLocaleString()} $AURA</span>
              </div>
            </div>
        </div>
    );
};

interface DashboardProps {
  bots: Bot[];
  isAdmin: boolean;
  wallet: WalletState;
  portfolioMetrics: PortfolioMetrics;
  isPortfolioSyncing: boolean;
  onSyncPortfolio: () => void;
  radarSignals: RadarSignal[];
  dailySignals: DailySignal[];
  connectedAccount: string | null;
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
  onOpenEarnModal: () => void;
  onProtocolReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const isWalletConnected = !!props.connectedAccount;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
            <PortfolioSummary 
                wallet={props.wallet} 
                metrics={props.portfolioMetrics}
                connectedAccount={props.connectedAccount}
                isSyncing={props.isPortfolioSyncing}
                onSync={props.onSyncPortfolio}
            />
        </div>
        <div className="lg:col-span-4">
            <DailySignals signals={props.dailySignals} />
        </div>
      </div>
      
      <CryptoRadar signals={props.radarSignals} />

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border-b border-slate-800 pb-6">
        <div>
            <div className="flex items-center space-x-2 text-cyan-500 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-black">Agent Execution Terminal</span>
            </div>
            <h2 className="text-5xl font-black font-space-grotesk text-white tracking-tighter uppercase italic">Protocols</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={props.onOpenEarnModal} 
            className="group relative bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 rounded-2xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center text-xs uppercase tracking-widest overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <GiftIcon className="h-4 w-4 mr-2 animate-bounce" /> Earn Protocol
          </button>

          <button 
            onClick={props.onOpenCreateBotModal} 
            disabled={!isWalletConnected}
            className="group relative bg-white text-slate-950 font-bold py-2.5 px-6 rounded-2xl transition-all hover:bg-cyan-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative flex items-center"><PlusCircleIcon className="h-4 w-4 mr-2" /> Deploy Protocol</span>
            {!isWalletConnected && <div className="absolute inset-0 bg-transparent group-hover:bg-black/70 flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">Connect Wallet First</div>}
          </button>
          
          <button onClick={props.onOpenBacktesting} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-5 rounded-2xl transition-all border border-slate-700 flex items-center text-xs uppercase tracking-widest">
            <BeakerIcon className="h-4 w-4 mr-2 text-purple-400" /> Playground
          </button>
          
          <button 
            onClick={props.onWithdraw} 
            disabled={!isWalletConnected}
            className="group relative bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-5 rounded-2xl transition-all border border-slate-700 flex items-center text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <WalletIcon className="h-4 w-4 mr-2 text-cyan-400" /> Vault
            {!isWalletConnected && <div className="absolute inset-0 bg-transparent group-hover:bg-black/70 flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">Connect Wallet</div>}
          </button>
          
          <button 
            onClick={props.onProtocolReset} 
            disabled={!isWalletConnected}
            className="group relative bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2.5 px-5 rounded-2xl transition-all border border-red-500/30 flex items-center text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="h-4 w-4 mr-2" /> Global Halt
             {!isWalletConnected && <div className="absolute inset-0 bg-transparent group-hover:bg-black/70 flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">Connect Wallet</div>}
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