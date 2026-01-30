
import React from 'react';
import { RadarSignal } from '../types';
import { SparklesIcon } from './Icons';

interface CryptoRadarProps {
  signals: RadarSignal[];
}

const SignalCard: React.FC<{ signal: RadarSignal }> = ({ signal }) => {
  const isBuy = signal.signal === 'buy';
  const returnColor = signal.projectedReturn >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="flex-shrink-0 w-64 h-full bg-slate-900/50 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between mx-3">
      <div className="flex justify-between items-center">
        <span className="font-mono font-bold text-white tracking-tighter">{signal.pair}</span>
        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${isBuy ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {signal.signal}
        </span>
      </div>
      <div className="text-right">
        <p className={`text-2xl font-mono font-black ${returnColor}`}>
            {signal.projectedReturn >= 0 ? '+' : ''}{signal.projectedReturn.toFixed(2)}%
        </p>
        <p className="text-[10px] font-mono text-slate-500">Win Rate: {signal.confidence.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export const CryptoRadar: React.FC<CryptoRadarProps> = ({ signals }) => {
  const duplicatedSignals = [...signals, ...signals, ...signals];

  return (
    <div className="glass-panel rounded-[2rem] p-6">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-purple-400" />
          <h2 className="text-sm font-bold font-space-grotesk text-white uppercase tracking-widest">Aura Intelligence Feed</h2>
        </div>
        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold py-1.5 px-3 rounded-lg transition-colors uppercase tracking-widest">
          Telegram Signals
        </a>
      </div>
      <div className="h-28 w-full overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-900/80 via-transparent to-slate-900/80 z-10 pointer-events-none" />
        <div className="flex h-full animate-scroll">
          {duplicatedSignals.map((signal, index) => (
            <SignalCard key={`${signal.id}-${index}`} signal={signal} />
          ))}
        </div>
      </div>
    </div>
  );
};
