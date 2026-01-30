
import React from 'react';
import TradingViewWidget from './TradingViewWidget';
import { XMarkIcon, ChartBarIcon } from './Icons';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  pair: string | null;
}

export const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose, pair }) => {
  if (!isOpen || !pair) return null;

  const tradingViewSymbol = `BINANCE:${pair.replace('/', '')}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl shadow-cyan-500/20 w-full max-w-4xl h-[70vh] m-4 transform transition-all duration-300 scale-100 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold font-space-grotesk text-white flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-3 text-cyan-400" />
            Live Chart: {pair}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-1 flex-grow">
          <TradingViewWidget symbol={tradingViewSymbol} />
        </div>
      </div>
    </div>
  );
};
