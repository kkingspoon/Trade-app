import React, { useEffect } from 'react';
import { WalletHook } from '../types';
import { XMarkIcon, MetamaskIcon } from './Icons';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletApi: WalletHook;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ isOpen, onClose, walletApi }) => {
  useEffect(() => {
    // Automatically close the modal once the wallet is connected.
    if (walletApi.connectedAccount && isOpen) {
      onClose();
    }
  }, [walletApi.connectedAccount, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[110] flex justify-center items-center backdrop-blur-xl p-4">
      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 w-full max-w-sm shadow-2xl p-8 text-center">
        <div className="flex justify-end mb-4">
            <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800 rounded-xl">
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
        
        <h2 className="text-2xl font-black font-space-grotesk text-white tracking-tighter uppercase italic">Connect Wallet</h2>
        <p className="text-sm text-slate-400 mt-2">Connect your wallet to interact with the AuraTrade protocol.</p>
        
        <div className="my-10">
            <button
                onClick={walletApi.connectWallet}
                disabled={walletApi.loading}
                className="w-full flex items-center justify-center bg-slate-800 border border-slate-700 hover:border-orange-500 text-white font-bold py-4 px-6 rounded-2xl transition-all disabled:opacity-50"
            >
                <MetamaskIcon className="h-6 w-6 mr-3 text-orange-500" />
                {walletApi.loading ? 'Connecting...' : 'Connect MetaMask'}
            </button>
        </div>
        
        {walletApi.error && (
            <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg">{walletApi.error}</p>
        )}
      </div>
    </div>
  );
};