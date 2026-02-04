import React, { useState } from 'react';
import { UserProfile, AuditEntry } from '../types';
import { XMarkIcon, ShieldCheckIcon, CpuChipIcon, KeyIcon, IpfsIcon } from './Icons';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  auditLogs: AuditEntry[];
  onIpfsSave: () => void;
  isIpfsSaving: boolean;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({ isOpen, onClose, profile, auditLogs, onIpfsSave, isIpfsSaving }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex justify-center items-center backdrop-blur-xl p-4">
      <div className="bg-slate-900 rounded-[3rem] border border-cyan-500/20 w-full max-w-2xl shadow-[0_0_100px_rgba(6,182,212,0.1)] overflow-hidden flex flex-col h-auto max-h-[85vh]">
        <div className="p-10 border-b border-slate-800/50 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black font-space-grotesk text-white tracking-tighter uppercase italic flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-cyan-400 mr-4" />
              Security Ops Center
            </h2>
            <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mt-2">Active Firewall Layer 7</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 rounded-2xl hover:text-white transition-all text-slate-500">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-grow p-10 overflow-y-auto custom-scrollbar space-y-10">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <p className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-widest font-bold">Session Integrity</p>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-400">UID:</span>
                    <span className="text-white font-mono">{profile.id}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-400">JWT Cipher:</span>
                    <span className="text-cyan-400 font-mono">AES-256-GCM</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-400">TOTP 2FA:</span>
                    <span className="text-green-400 font-bold">ENABLED</span>
                 </div>
              </div>
            </div>
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <p className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-widest font-bold">Network Context</p>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-400">IP Origin:</span>
                    <span className="text-white font-mono">{profile.lastLoginIp}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-400">SSL Cert:</span>
                    <span className="text-white font-mono">Cloudflare V3</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black font-space-grotesk text-white uppercase tracking-widest">Decentralized Backup</h3>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/30 flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-bold">Save Bot Configuration to IPFS</p>
                <p className="text-xs text-slate-500 mt-1">Create an immutable, decentralized backup of your active strategies.</p>
              </div>
              <button
                onClick={onIpfsSave}
                disabled={isIpfsSaving}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-5 rounded-xl transition-all disabled:opacity-50 flex items-center text-xs uppercase"
              >
                <IpfsIcon className={`h-4 w-4 mr-2 ${isIpfsSaving ? 'animate-spin' : ''}`} />
                {isIpfsSaving ? 'Encrypting...' : 'Save Snapshot'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black font-space-grotesk text-white uppercase tracking-widest">Protocol Audit Logs</h3>
                <span className="text-[10px] font-mono text-slate-600 italic">Historical Chain // Last 20 Events</span>
             </div>
             <div className="space-y-3">
                {auditLogs.map(log => (
                  <div key={log.id} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/30 flex items-center justify-between group hover:border-cyan-500/20 transition-all">
                    <div className="flex items-center space-x-4">
                       <div className={`h-2 w-2 rounded-full ${log.severity === 'high' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-slate-700'}`} />
                       <span className="text-xs text-slate-300 font-medium">{log.event}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};