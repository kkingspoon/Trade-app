
import React, { useState } from 'react';
import { BacktestResults } from '../types';
import { XMarkIcon, BeakerIcon, CpuChipIcon, ShieldCheckIcon } from './Icons';

interface BacktestingModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  results: BacktestResults | null;
  onRunBacktest: (pair: string, timeframe: string, components: string[]) => void;
}

const strategyComponents = [
  { id: 'ma', label: 'Moving Average Crossover' },
  { id: 'trend', label: 'Bullish Trend Confirmation' },
  { id: 'institutional', label: 'Institutional Inflow Tracker' },
  { id: 'congress', label: 'Congressional Trade Monitor' },
  { id: 'whale', label: 'On-Chain Whale Accumulation' },
];

export const BacktestingModal: React.FC<BacktestingModalProps> = ({ isOpen, onClose, loading, results, onRunBacktest }) => {
  const [pair, setPair] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('4H');
  const [selectedComponents, setSelectedComponents] = useState<string[]>(['ma', 'trend']);

  if (!isOpen) return null;

  const handleComponentToggle = (id: string) => {
    setSelectedComponents(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleRun = () => {
    onRunBacktest(pair, timeframe, selectedComponents);
  };
  
  const ResultCard: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = 'text-white' }) => (
    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-mono font-black ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 z-[110] flex justify-center items-center backdrop-blur-xl p-4">
      <div className="bg-slate-900 rounded-[2.5rem] border border-purple-500/20 w-full max-w-4xl shadow-[0_0_100px_rgba(188,19,254,0.1)] overflow-hidden flex flex-col h-auto max-h-[90vh]">
        <div className="p-8 border-b border-slate-800/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black font-space-grotesk text-white tracking-tighter uppercase italic flex items-center">
              <BeakerIcon className="h-7 w-7 text-purple-400 mr-4" />
              Strategy Playground
            </h2>
            <p className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.4em] mt-1">AI-Powered Backtesting Engine</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800 rounded-xl">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2 font-bold tracking-widest">Asset Pair</label>
              <select value={pair} onChange={e => setPair(e.target.value)} className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 text-sm focus:border-purple-500 outline-none font-mono">
                <option>BTC/USDT</option>
                <option>ETH/USDT</option>
                <option>SOL/USDT</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2 font-bold tracking-widest">Timeframe</label>
              <select value={timeframe} onChange={e => setTimeframe(e.target.value)} className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 text-sm focus:border-purple-500 outline-none font-mono">
                <option>1H</option>
                <option>4H</option>
                <option>1D</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2 font-bold tracking-widest">Strategy Components</label>
              <div className="space-y-2">
                {strategyComponents.map(comp => (
                  <button key={comp.id} onClick={() => handleComponentToggle(comp.id)} className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-bold ${selectedComponents.includes(comp.id) ? 'bg-purple-600/20 border-purple-500/50 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                    {comp.label}
                  </button>
                ))}
              </div>
            </div>
             <button onClick={handleRun} disabled={loading || selectedComponents.length === 0} className="w-full bg-white text-black font-black py-3 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Analyzing...' : 'Run Simulation'}
            </button>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {loading && (
               <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center h-full">
                <div className="relative flex items-center justify-center h-24 w-24">
                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full animate-ping"></div>
                    <CpuChipIcon className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-space-grotesk">PROCESSING HISTORICAL DATA...</h3>
                <p className="text-xs text-slate-500">Aura AI is simulating trades based on your selected parameters.</p>
            </div>
            )}
            {!loading && results && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <ResultCard label="Net Profit (USDT)" value={`$${results.netProfit.toLocaleString()}`} color={results.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}/>
                    <ResultCard label="Total Return" value={`${results.totalReturn.toFixed(2)}%`} color={results.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}/>
                    <ResultCard label="Win Rate" value={`${results.winRate.toFixed(1)}%`} color="text-cyan-400"/>
                    <ResultCard label="Max Drawdown" value={`${results.maxDrawdown.toFixed(2)}%`} color="text-orange-400"/>
                    <ResultCard label="Total Trades" value={results.totalTrades.toString()} />
                </div>
                <div>
                   <h4 className="text-[10px] font-mono text-slate-500 uppercase mb-2 font-bold tracking-widest">AI Performance Summary</h4>
                   <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800/50">
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{results.summary}</p>
                   </div>
                </div>
              </div>
            )}
             {!loading && !results && (
                 <div className="flex flex-col items-center justify-center h-full text-center p-10">
                    <BeakerIcon className="h-16 w-16 text-slate-800 mb-4" />
                    <h3 className="font-bold text-white font-space-grotesk">AWAITING SIMULATION</h3>
                    <p className="text-xs text-slate-500 mt-1">Configure your strategy and run the backtest.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
