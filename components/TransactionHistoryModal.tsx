
import React from 'react';
import { Transaction } from '../types';
import { XMarkIcon, GlobeIcon, ArrowDownCircleIcon, ArrowTrendingUpIcon, ReceiptPercentIcon } from './Icons';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
        case 'deposit': return <ArrowDownCircleIcon className="h-4 w-4 text-green-400" />;
        case 'withdraw': return <ArrowTrendingUpIcon className="h-4 w-4 text-orange-400" />;
        case 'allocation': return <GlobeIcon className="h-4 w-4 text-cyan-400" />;
        case 'fee_deduction': return <ReceiptPercentIcon className="h-4 w-4 text-purple-400" />;
        default: return <GlobeIcon className="h-4 w-4 text-slate-500" />;
    }
};


export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({ isOpen, onClose, transactions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center backdrop-blur-md p-4">
      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-8 border-b border-slate-800/50">
          <div>
            <h2 className="text-2xl font-black font-space-grotesk text-white uppercase tracking-tighter italic">Protocol Ledger</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Immutable Transaction History</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800 rounded-2xl border border-slate-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <table className="w-full text-left font-mono">
            <thead className="text-[10px] text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
              <tr>
                <th className="pb-4 font-bold">Timestamp</th>
                <th className="pb-4 font-bold">Type</th>
                <th className="pb-4 font-bold">Volume</th>
                <th className="pb-4 font-bold">Node Status</th>
                <th className="pb-4 font-bold text-right">Identifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {transactions.map(tx => (
                <tr key={tx.id} className="group hover:bg-slate-800/30 transition-colors">
                  <td className="py-5 text-xs text-slate-400">{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className="py-5">
                    <div className="flex items-center space-x-2">
                       {getTransactionIcon(tx.type)}
                       <span className="text-[10px] font-bold text-white uppercase">{tx.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className={`py-5 text-sm font-black ${tx.type === 'fee_deduction' ? 'text-purple-400' : 'text-white'}`}>
                    {tx.amount.toLocaleString(undefined, { minimumFractionDigits: tx.type === 'fee_deduction' ? 4 : 2, maximumFractionDigits: 4 })}
                     <span className="text-[10px] text-slate-500 font-normal"> USDT</span>
                  </td>
                  <td className="py-5">
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase border ${
                      tx.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                      tx.status === 'processing' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30 animate-pulse' :
                      'bg-orange-500/10 text-orange-500 border-orange-500/30'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-5 text-right text-[9px] text-slate-600 group-hover:text-cyan-500 transition-colors">{tx.txHash || 'INTERNAL_SYNC'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
