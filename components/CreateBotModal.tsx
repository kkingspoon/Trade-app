
import React, { useState, FormEvent } from 'react';
import { BotStrategy, BotData, WhitelistPair } from '../types';
// Added ShieldCheckIcon to the list of imports from Icons
import { XMarkIcon, PlusCircleIcon, WalletIcon, ListBulletIcon, ShieldCheckIcon } from './Icons';

interface CreateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBot: (botData: BotData) => void;
  whitelist: WhitelistPair[];
  masterWallet: string | null;
  // Added availableBalance prop to fix the missing property error
  availableBalance: number;
}

export const CreateBotModal: React.FC<CreateBotModalProps> = ({ isOpen, onClose, onCreateBot, whitelist, masterWallet, availableBalance }) => {
  const [name, setName] = useState('');
  const [pair, setPair] = useState(whitelist.length > 0 ? whitelist[0].pair : '');
  const [strategy, setStrategy] = useState<BotStrategy>(BotStrategy.GRID);
  const [walletAddress, setWalletAddress] = useState(masterWallet || '');
  const [useMasterWallet, setUseMasterWallet] = useState(!!masterWallet);
  const [investment, setInvestment] = useState('1000');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !pair) return; 
    onCreateBot({ 
        name, 
        pair, 
        strategy, 
        investment,
        walletAddress: useMasterWallet ? (masterWallet || walletAddress) : walletAddress 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-2xl m-4 transform transition-all duration-300 scale-100 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-black font-space-grotesk text-white flex items-center uppercase tracking-tight">
            <PlusCircleIcon className="h-6 w-6 mr-3 text-cyan-400" />
            New Agent Deployment
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1 font-bold">Bot Designation</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="E.G. NEURAL STRIKE 01" required
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none transition-all font-mono" />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1 font-bold">Authorized Pair</label>
                <select
                  value={pair} onChange={(e) => setPair(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none font-mono"
                >
                  {whitelist.length > 0 ? (
                      whitelist.map(w => <option key={w.id} value={w.pair}>{w.pair}</option>)
                  ) : (
                      <option disabled>NO WHITELISTED PAIRS</option>
                  )}
                </select>
                {whitelist.length === 0 && <p className="text-[9px] text-red-400 mt-1 uppercase font-bold">Go to Whitelist Manager first</p>}
              </div>

               <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1 font-bold">Allocation (USDT)</label>
                <div className="relative">
                  <input
                    type="number" value={investment} onChange={(e) => setInvestment(e.target.value)}
                    placeholder="1000" min="100" max={availableBalance} required
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none font-mono pr-20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 font-bold uppercase">Max: {availableBalance.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1 font-bold">Strategy Protocol</label>
                <select
                    value={strategy} onChange={(e) => setStrategy(e.target.value as BotStrategy)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none font-mono"
                >
                    {Object.values(BotStrategy).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

               <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1 font-bold">Settlement Layer</label>
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 space-y-3">
                    <label className="flex items-center cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={useMasterWallet} 
                            onChange={(e) => setUseMasterWallet(e.target.checked)}
                            disabled={!masterWallet}
                            className="hidden"
                        />
                        <div className={`h-4 w-4 rounded border flex items-center justify-center mr-2 transition-all ${useMasterWallet ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 bg-slate-800'}`}>
                            {useMasterWallet && <ShieldCheckIcon className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">Inherit Master Wallet</span>
                    </label>
                    <input 
                        type="text" 
                        value={useMasterWallet ? (masterWallet || '') : walletAddress} 
                        onChange={(e) => setWalletAddress(e.target.value)}
                        readOnly={useMasterWallet}
                        placeholder="0x..." 
                        className={`w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-[10px] font-mono outline-none ${useMasterWallet ? 'text-cyan-500' : 'text-white focus:border-cyan-500'}`} 
                    />
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="p-5 bg-slate-900 border-t border-gray-700 flex justify-end items-center gap-4">
          <button type="button" onClick={onClose} className="text-slate-400 font-bold py-2 px-6 rounded-xl hover:text-white transition-all text-xs uppercase tracking-widest">
            Abort
          </button>
          <button
            type="submit"
            className="bg-white text-slate-950 font-black py-2.5 px-8 rounded-xl transition-all hover:bg-cyan-50 disabled:opacity-50 text-xs uppercase tracking-widest"
            disabled={!name || !pair || (whitelist.length === 0)}
          >
            Deploy Agent
          </button>
        </div>
      </form>
    </div>
  );
};
