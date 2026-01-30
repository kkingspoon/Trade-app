
import React from 'react';
import { UserProfile, WalletState } from '../types';
import { XMarkIcon, ShieldCheckIcon, SparklesIcon, ReceiptPercentIcon } from './Icons';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  wallet: WalletState;
}

export const MonetizationModal: React.FC<MonetizationModalProps> = ({ isOpen, onClose, profile, wallet }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex justify-center items-center backdrop-blur-xl p-4">
      <div className="bg-slate-900 rounded-[3rem] border border-purple-500/20 w-full max-w-2xl shadow-[0_0_100px_rgba(188,19,254,0.1)] overflow-hidden flex flex-col h-auto">
        <div className="p-10 border-b border-slate-800/50 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black font-space-grotesk text-white tracking-tighter uppercase italic flex items-center">
              <ReceiptPercentIcon className="h-8 w-8 text-purple-400 mr-4" />
              Protocol Access
            </h2>
            <p className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.4em] mt-2">Monetization Layer</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 rounded-2xl hover:text-white transition-all text-slate-500">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-10 space-y-10">
          <div className="bg-gradient-to-br from-purple-600/20 to-slate-900/10 p-8 rounded-3xl border border-purple-500/30 text-center">
            <span className="text-sm font-mono text-purple-400 uppercase tracking-widest">Current Tier</span>
            <h3 className="text-5xl font-black font-space-grotesk text-white mt-2 mb-4 uppercase">{profile.plan}</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">Your access level provides elite-grade tools and preferential rates across the protocol.</p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-black font-space-grotesk text-white uppercase tracking-widest text-center">Elite Tier Privileges</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-950/70 p-4 rounded-2xl flex items-center space-x-3 border border-slate-800">
                    <ShieldCheckIcon className="h-5 w-5 text-green-400 flex-shrink-0"/>
                    <span className="text-slate-300">Unlimited Bot Deployments</span>
                </div>
                 <div className="bg-slate-950/70 p-4 rounded-2xl flex items-center space-x-3 border border-slate-800">
                    <SparklesIcon className="h-5 w-5 text-cyan-400 flex-shrink-0"/>
                    <span className="text-slate-300">Advanced AI Models</span>
                </div>
                 <div className="bg-slate-950/70 p-4 rounded-2xl flex items-center space-x-3 border border-slate-800">
                    <ReceiptPercentIcon className="h-5 w-5 text-purple-400 flex-shrink-0"/>
                    <span className="text-slate-300">5% Performance Fee Rate</span>
                </div>
                 <div className="bg-slate-950/70 p-4 rounded-2xl flex items-center space-x-3 border border-slate-800">
                    <SparklesIcon className="h-5 w-5 text-yellow-400 flex-shrink-0"/>
                    <span className="text-slate-300">Priority API Gateway</span>
                </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center">
            <h4 className="text-sm font-mono text-purple-400 uppercase tracking-widest">AURA Utility Token</h4>
            <p className="text-4xl font-mono font-black text-white my-3">{wallet.auraBalance.toLocaleString()} <span className="text-purple-400 text-2xl">$AURA</span></p>
            <p className="text-xs text-slate-500">Use $AURA to pay protocol fees for a <span className="font-bold text-slate-300">20% discount</span>. More utility coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
