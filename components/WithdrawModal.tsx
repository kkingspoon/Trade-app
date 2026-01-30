
import React, { useState } from 'react';
import { WalletState } from '../types';
import { XMarkIcon, WalletIcon, ShieldCheckIcon, ArrowDownCircleIcon, ArrowTrendingUpIcon } from './Icons';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConfirmWithdraw: (amount: number, address: string) => void;
  onConfirmDeposit: (amount: number) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, wallet, onConfirmWithdraw, onConfirmDeposit }) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('withdraw');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [step, setStep] = useState<'details' | '2fa'>('details');
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'withdraw') {
      if (step === 'details') {
        setStep('2fa');
      } else {
        onConfirmWithdraw(parseFloat(amount), address);
        handleClose();
      }
    } else {
      onConfirmDeposit(parseFloat(amount));
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setStep('details');
    setAmount('');
    setAddress('');
    setOtp('');
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[110] flex justify-center items-center backdrop-blur-xl p-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 rounded-[2.5rem] border border-slate-800 w-full max-w-md shadow-2xl p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black font-space-grotesk text-white tracking-tighter uppercase italic">Capital Command</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Global Liquidity Pool Manager</p>
          </div>
          <button type="button" onClick={handleClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800 rounded-xl">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setActiveTab('deposit'); setStep('details'); }}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'deposit' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Deposit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'withdraw' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Withdraw
          </button>
        </div>

        {step === 'details' ? (
          <div className="space-y-6">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
               <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Current Pool</span>
                <span className="text-xs font-mono text-white">${wallet.available.toLocaleString()} {wallet.currency}</span>
               </div>
               <div className="p-2 bg-slate-900 rounded-lg">
                {activeTab === 'deposit' ? <ArrowDownCircleIcon className="h-5 w-5 text-cyan-400" /> : <ArrowTrendingUpIcon className="h-5 w-5 text-purple-400" />}
               </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest px-1">Amount to {activeTab}</label>
              <input 
                type="number" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0.00" step="10" min="10" required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-mono focus:border-cyan-500 outline-none transition-all"
              />
            </div>

            {activeTab === 'withdraw' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest px-1">Destination Hash (Address)</label>
                <input 
                  type="text" value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="0x..." required
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                />
              </div>
            )}

            {activeTab === 'deposit' && (
              <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="text-[10px] font-mono text-cyan-500 uppercase font-bold block text-center">Your Deposit Address</span>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400 truncate pr-4">0xAuraEliteMasterNode_{Math.random().toString(16).slice(2, 12)}</span>
                  <button type="button" className="text-[9px] font-bold text-cyan-400 uppercase hover:text-white transition-colors">Copy</button>
                </div>
                <p className="text-[9px] text-slate-500 italic text-center leading-relaxed">External confirmations usually settle in 3-5 blocks.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 py-4 flex flex-col items-center">
            <div className="p-4 bg-purple-600/10 rounded-full">
              <ShieldCheckIcon className="h-12 w-12 text-purple-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-white font-bold font-space-grotesk uppercase tracking-widest">Withdrawal Validation</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">Enter the unique hash from your security device to authorize transfer.</p>
            </div>
            <input 
              type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000" maxLength={6} required
              className="w-40 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center text-2xl font-mono tracking-[0.5em] text-cyan-400 focus:border-cyan-500 outline-none"
            />
          </div>
        )}

        <button 
          type="submit"
          className={`w-full font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg ${
            activeTab === 'deposit' ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-white text-black hover:bg-slate-100'
          }`}
        >
          {activeTab === 'deposit' ? 'Confirm Inbound Deposit' : (step === 'details' ? 'Next Protocol Stage' : 'Finalize Transfer')}
        </button>
      </form>
    </div>
  );
};
