
import React, { useState } from 'react';
import { PriceAlert } from '../types';
import { XMarkIcon, BellIcon, TrashIcon, PlusCircleIcon } from './Icons';

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: PriceAlert[];
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'isActive'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleAlert: (id: string) => void;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({ isOpen, onClose, alerts, onAddAlert, onDeleteAlert, onToggleAlert }) => {
  const [pair, setPair] = useState('BTC/USDT');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pair || !targetPrice) return;
    onAddAlert({
      pair: pair.toUpperCase(),
      targetPrice: parseFloat(targetPrice),
      condition
    });
    setTargetPrice('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-2xl transform transition-all flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <div className="flex items-center">
            <BellIcon className="h-6 w-6 mr-3 text-cyan-400" />
            <h2 className="text-xl font-black font-space-grotesk text-white">Price Alerts Manager</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto space-y-6">
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-700">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Create New Alert</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Asset Pair</label>
                <input
                  type="text" value={pair} onChange={(e) => setPair(e.target.value)}
                  placeholder="BTC/USDT"
                  className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-2 text-sm focus:border-cyan-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Condition</label>
                <select
                  value={condition} onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                  className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-2 text-sm focus:border-cyan-500 outline-none"
                >
                  <option value="above">Price Above</option>
                  <option value="below">Price Below</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Target Price</label>
                <input
                  type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="0.00" step="0.0001"
                  className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-2 text-sm focus:border-cyan-500 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!targetPrice}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" /> ADD
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Active Watches</h3>
            {alerts.length === 0 ? (
              <div className="text-center py-10 text-slate-500 italic">No alerts configured.</div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className={`glass-panel p-4 rounded-xl flex items-center justify-between border ${alert.isActive ? 'border-slate-700' : 'border-slate-800 opacity-60'}`}>
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-4 ${alert.condition === 'above' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      <BellIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg font-space-grotesk tracking-tight">{alert.pair}</p>
                      <p className="text-xs font-mono text-slate-500">
                        Trigger if <span className="text-slate-300 font-bold">{alert.condition.toUpperCase()}</span> ${alert.targetPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onToggleAlert(alert.id)}
                      className={`h-6 w-11 rounded-full relative transition-all ${alert.isActive ? 'bg-cyan-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${alert.isActive ? 'right-1' : 'left-1'}`} />
                    </button>
                    <button
                      onClick={() => onDeleteAlert(alert.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-xl font-bold transition-all">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
