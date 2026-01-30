
import React, { useState } from 'react';
import { WhitelistPair } from '../types';
import { XMarkIcon, ListBulletIcon, TrashIcon, PlusCircleIcon } from './Icons';

interface WhitelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  whitelist: WhitelistPair[];
  onTogglePair: (id: string) => void;
  onAddPair: (pair: string) => void;
  onDeletePair: (id: string) => void;
}

export const WhitelistModal: React.FC<WhitelistModalProps> = ({ isOpen, onClose, whitelist, onTogglePair, onAddPair, onDeletePair }) => {
  const [newPair, setNewPair] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPair.trim()) {
        onAddPair(newPair);
        setNewPair('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <div className="flex items-center">
            <ListBulletIcon className="h-6 w-6 mr-3 text-cyan-400" />
            <h2 className="text-xl font-black font-space-grotesk text-white uppercase tracking-tight">Whitelist Manager</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input 
                type="text" 
                value={newPair} 
                onChange={(e) => setNewPair(e.target.value.toUpperCase())}
                placeholder="E.G. LINK/USDT"
                className="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none font-mono"
            />
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl font-bold transition-all flex items-center text-xs">
                <PlusCircleIcon className="h-4 w-4 mr-1" /> ADD
            </button>
          </form>

          <div className="space-y-3">
            {whitelist.map(item => (
                <div key={item.id} className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                         <button 
                            onClick={() => onTogglePair(item.id)}
                            className={`h-5 w-9 rounded-full relative transition-all ${item.isActive ? 'bg-cyan-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.isActive ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                        <span className={`font-mono font-bold tracking-tight ${item.isActive ? 'text-white' : 'text-slate-600'}`}>{item.pair}</span>
                    </div>
                    <button onClick={() => onDeletePair(item.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-900/30 border-t border-gray-700 flex justify-end">
          <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-xl font-bold transition-all text-xs">CLOSE</button>
        </div>
      </div>
    </div>
  );
};
