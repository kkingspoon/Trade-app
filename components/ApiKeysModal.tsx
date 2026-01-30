
import React, { useState, FormEvent } from 'react';
import { ApiKey } from '../types';
import { XMarkIcon, KeyIcon, EyeIcon, TrashIcon, GlobeIcon, ShieldCheckIcon } from './Icons';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiKey[];
  onAddKey: (key: Omit<ApiKey, 'id'>) => void;
  onDeleteKey: (keyId: string) => void;
}

export const ApiKeysModal: React.FC<ApiKeysModalProps> = ({ isOpen, onClose, apiKeys, onAddKey, onDeleteKey }) => {
  const [exchange, setExchange] = useState('Binance');
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [syncingKeys, setSyncingKeys] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!apiKey || !secretKey) return;
    onAddKey({ exchange, key: apiKey, secret: secretKey });
    setApiKey('');
    setSecretKey('');
  };

  const toggleSecretVisibility = (keyId: string) => {
    setVisibleSecrets(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };
  
  const handleVerifySync = async (keyId: string) => {
    setSyncingKeys(prev => ({ ...prev, [keyId]: true }));
    await new Promise(r => setTimeout(r, 1500));
    setSyncingKeys(prev => ({ ...prev, [keyId]: false }));
  };

  const maskKey = (key: string) => `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl shadow-purple-500/20 w-full max-w-2xl m-4 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold font-space-grotesk text-white flex items-center">
            <KeyIcon className="h-6 w-6 mr-3 text-purple-400" />
            Manage API Keys
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
            <div className="space-y-3 mb-6">
                {apiKeys.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 italic text-sm">No external exchange links established.</div>
                ) : (
                    apiKeys.map(key => (
                        <div key={key.id} className="bg-gray-900/50 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <p className="font-bold text-white uppercase tracking-tight text-sm">{key.exchange}</p>
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                </div>
                                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Key: {maskKey(key.key)}</p>
                                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Secret: {visibleSecrets[key.id] ? key.secret : '••••••••••••••••'} </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => handleVerifySync(key.id)}
                                    className={`p-2 rounded-lg transition-all border ${syncingKeys[key.id] ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'text-slate-500 border-transparent hover:border-slate-600'}`}
                                    title="Verify & Sync Account"
                                >
                                    {syncingKeys[key.id] ? <GlobeIcon className="h-4 w-4 animate-spin" /> : <ShieldCheckIcon className="h-4 w-4" />}
                                </button>
                                <button onClick={() => toggleSecretVisibility(key.id)} className="text-slate-500 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-colors"><EyeIcon className="h-4 w-4"/></button>
                                <button onClick={() => onDeleteKey(key.id)} className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"><TrashIcon className="h-4 w-4"/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="border-t border-gray-700 pt-6">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Add New Exchange Pipeline</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="exchange" className="block text-[10px] font-mono text-slate-500 uppercase mb-1 font-bold">Exchange Terminal</label>
                        <select id="exchange" value={exchange} onChange={e => setExchange(e.target.value)} className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-2.5 text-sm focus:border-purple-500 outline-none font-mono">
                            <option>Binance</option>
                            <option>Coinbase Pro</option>
                            <option>Kraken</option>
                            <option>KuCoin</option>
                            <option>ByBit</option>
                        </select>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="apiKey" className="block text-[10px] font-mono text-slate-500 uppercase mb-1 font-bold">API Access Key</label>
                            <input type="text" id="apiKey" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="0x..." className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-2.5 text-sm focus:border-purple-500 outline-none font-mono"/>
                        </div>
                        <div>
                            <label htmlFor="secretKey" className="block text-[10px] font-mono text-slate-500 uppercase mb-1 font-bold">API Secret Hash</label>
                            <input type="password" id="secretKey" value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder="••••••••" className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-2.5 text-sm focus:border-purple-500 outline-none font-mono"/>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                         <button type="submit" disabled={!apiKey || !secretKey} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest">
                            Initialize Link
                        </button>
                    </div>
                </form>
            </div>
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
