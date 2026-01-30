
import React from 'react';
import { Bot } from '../types';
import { XMarkIcon, ListBulletIcon, TrashIcon } from './Icons';

interface TradeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: Bot | null;
  onFlushLogs: () => void;
}

export const TradeLogModal: React.FC<TradeLogModalProps> = ({ isOpen, onClose, bot, onFlushLogs }) => {
  if (!isOpen || !bot) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl shadow-purple-500/20 w-full max-w-3xl m-4 transform transition-all duration-300 scale-100 flex flex-col h-[70vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center">
            <ListBulletIcon className="h-6 w-6 mr-3 text-purple-400" />
            <h2 className="text-xl font-bold font-space-grotesk text-white">Ledger: {bot.name}</h2>
          </div>
          <div className="flex items-center space-x-3">
             <button 
                onClick={onFlushLogs}
                className="flex items-center text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20"
            >
                <TrashIcon className="h-3.5 w-3.5 mr-1.5" /> Purge
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-1 flex-grow overflow-y-auto">
            {bot.trades && bot.trades.length > 0 ? (
                <div className="relative">
                     <table className="w-full text-[11px] text-left text-gray-300">
                        <thead className="text-[10px] text-gray-500 uppercase bg-gray-900/50 sticky top-0 font-mono">
                            <tr>
                                <th scope="col" className="px-6 py-3">Timestamp</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3 text-right">PNL (USDT)</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono">
                            {bot.trades.map((trade) => (
                                <tr key={trade.id} className="bg-gray-800/80 border-b border-gray-700 hover:bg-gray-700/60">
                                    <td className="px-6 py-4">{trade.timestamp}</td>
                                    <td className={`px-6 py-4 font-bold ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                                        {trade.type.toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">${trade.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">{trade.amount}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {trade.pnl > 0 ? `+${trade.pnl.toFixed(2)}` : trade.pnl.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-50">
                    <ListBulletIcon className="h-10 w-10 text-slate-600" />
                    <p className="text-sm font-mono uppercase tracking-widest text-slate-500">Log Buffer Empty</p>
                </div>
            )}
        </div>
        <div className="p-4 bg-gray-900/50 border-t border-gray-700 rounded-b-xl flex justify-end">
            <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-xl transition-all text-xs uppercase tracking-widest">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
