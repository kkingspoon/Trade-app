
import React from 'react';
import { DailySignal } from '../types';
import { ArrowTrendingUpIcon } from './Icons';

interface DailySignalsProps {
  signals: DailySignal[];
}

export const DailySignals: React.FC<DailySignalsProps> = ({ signals }) => {
  return (
    <div className="glass-panel rounded-[2rem] p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ArrowTrendingUpIcon className="h-5 w-5 text-purple-400 mr-2" />
          <h2 className="text-lg font-bold font-space-grotesk text-white uppercase tracking-tight">Daily Signal Matrix</h2>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 uppercase">Live Feed</span>
      </div>
      <div className="flex-grow space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
        {signals.map(signal => (
          <div key={signal.id} className="grid grid-cols-4 items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
            <div className="col-span-1 font-mono font-bold text-white text-xs">{signal.pair}</div>
            <div className={`col-span-1 text-xs font-black uppercase ${signal.type === 'long' ? 'text-green-400' : 'text-red-400'}`}>{signal.type}</div>
            <div className="col-span-1 text-xs font-mono text-slate-400">@{signal.entryPrice}</div>
            <div className="col-span-1 text-right">
              {signal.status === 'open' ? (
                <span className="text-[9px] font-mono text-cyan-400 animate-pulse uppercase">OPEN</span>
              ) : (
                <span className={`text-xs font-mono font-bold ${signal.pnl != null && signal.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {signal.pnl != null && signal.pnl >= 0 ? `+${signal.pnl.toFixed(2)}` : signal.pnl?.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
