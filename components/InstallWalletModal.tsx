
import React from 'react';
import { XMarkIcon, PuzzlePieceIcon } from './Icons';

interface InstallWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallWalletModal: React.FC<InstallWalletModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl shadow-cyan-500/20 w-full max-w-md m-4 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold font-space-grotesk text-white flex items-center">
            <PuzzlePieceIcon className="h-6 w-6 mr-3 text-cyan-400" />
            Wallet Not Detected
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-300 mb-4">
            To use the withdraw feature, you need a browser wallet like MetaMask.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Please install a wallet extension and refresh the page to continue.
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
          >
            Install MetaMask
          </a>
        </div>
        <div className="p-4 bg-gray-900/50 border-t border-gray-700 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
