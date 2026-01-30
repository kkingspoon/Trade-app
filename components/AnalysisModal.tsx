
import React from 'react';
import { Bot } from '../types';
import { XMarkIcon, BrainCircuitIcon } from './Icons';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  result: string;
  bot: Bot | null;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, loading, result, bot }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl shadow-cyan-500/20 w-full max-w-lg m-4 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold font-space-grotesk text-white flex items-center">
            <BrainCircuitIcon className="h-6 w-6 mr-3 text-cyan-400" />
            AI Trading Analysis
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {bot && (
            <div className="mb-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
              <p className="text-lg font-semibold text-cyan-300">{bot.name}</p>
              <p className="text-sm text-gray-400">{bot.pair} - {bot.strategy}</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center space-y-3 p-8">
                <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-300">Aura AI is analyzing market data...</p>
            </div>
          )}

          {!loading && result && (
            <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed max-h-80 overflow-y-auto p-4 bg-gray-900/50 rounded-md">
                {result}
            </div>
          )}
        </div>
         <div className="p-4 bg-gray-900/50 border-t border-gray-700 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
