import React from 'react';
import { XMarkIcon, MetamaskIcon, PuzzlePieceIcon } from './Icons';

interface InstallWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallWalletModal: React.FC<InstallWalletModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[110] flex justify-center items-center backdrop-blur-xl p-4">
      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 w-full max-w-sm shadow-2xl p-8 text-center">
        <div className="flex justify-end mb-4">
            <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800 rounded-xl">
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
        
        <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 text-orange-500 mb-6">
            <PuzzlePieceIcon className="h-8 w-8" />
        </div>
        
        <h2 className="text-2xl font-black font-space-grotesk text-white tracking-tighter uppercase italic">Wallet Required</h2>
        <p className="text-sm text-slate-400 mt-2">To interact with the protocol, you need a browser wallet like MetaMask.</p>
        
        <div className="my-10">
            <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl transition-all"
            >
                <MetamaskIcon className="h-6 w-6 mr-3" />
                Install MetaMask
            </a>
        </div>
        
        <p className="text-xs text-slate-500">After installation, please refresh the page to connect.</p>
      </div>
    </div>
  );
};