
import React from 'react';
import { MarketPattern } from '../types';
import { XMarkIcon, Squares2X2Icon, CpuChipIcon, GlobeIcon } from './Icons';

interface PatternRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  patterns: MarketPattern[];
}

export const PatternRecognitionModal: React.FC<PatternRecognitionModalProps> = ({ isOpen, onClose, loading, patterns }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[110] flex justify-center items-center backdrop-blur-xl p-4">
      <div className="bg-slate-900 rounded-[2.5rem] border border-purple-500/20 w-full max-w-2xl shadow-[0_0_100px_rgba(188,19,254,0.1)] overflow-hidden flex flex-col h-auto max-h-[80vh]">
        <div className="p-8 border-b border-slate-800/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black font-space-grotesk text-white tracking-tighter uppercase italic flex items-center">
              <Squares2X2Icon className="h-7 w-7 text-purple-400 mr-4" />
              Pattern Recognition
            </h2>
            <p className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.4em] mt-1">Live Market Analysis</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800 rounded-xl">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 flex-grow overflow-y-auto custom-scrollbar">
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center">
                <div className="relative flex items-center justify-center h-24 w-24">
                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full animate-ping"></div>
                    <CpuChipIcon className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-space-grotesk">ACCESSING LIVE MARKET DATA...</h3>
                <p className="text-xs text-slate-500">Aura AI is deploying pattern recognition algorithms via Google Search.</p>
            </div>
          )}

          {!loading && patterns.length > 0 && (
            <div className="space-y-6">
              {patterns.map((pattern, index) => (
                <div key={index} className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800/50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold font-space-grotesk text-cyan-400 uppercase">{pattern.name}</h3>
                      <p className="text-xs font-mono text-slate-500">{pattern.asset} - {pattern.timeframe}</p>
                    </div>
                    <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded border uppercase tracking-widest border-green-400/30 bg-green-400/10 text-green-400">
                      CONFIDENCE: HIGH
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{pattern.description}</p>
                  
                  {pattern.sources && pattern.sources.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-800/50">
                        <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center">
                           <GlobeIcon className="h-3 w-3 mr-1.5"/> Data Sources
                        </h4>
                        <div className="space-y-2">
                            {pattern.sources.map((source, i) => (
                                <a 
                                    key={i} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block text-xs text-cyan-400 hover:text-cyan-300 hover:underline truncate transition-colors font-mono"
                                >
                                    {source.title}
                                </a>
                            ))}
                        </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
