import React, { useState, useEffect } from 'react';
import { EarnMission } from '../types';
import { XMarkIcon, GiftIcon, AcademicCapIcon, CurrencyDollarIcon, SparklesIcon } from './Icons';

interface EarnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimFaucet: () => void;
  onCompleteMission: (mission: EarnMission) => void;
  isMissionLoading: boolean;
  mission: EarnMission | null;
  lastFaucetClaim?: number;
}

export const EarnModal: React.FC<EarnModalProps> = ({ 
  isOpen, onClose, onClaimFaucet, onCompleteMission, isMissionLoading, mission, lastFaucetClaim 
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [missionStatus, setMissionStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');

  if (!isOpen) return null;

  const handleMissionSubmit = () => {
    if (selectedOption === null || !mission) return;
    if (selectedOption === mission.correctAnswer) {
      setMissionStatus('correct');
      setTimeout(() => {
        onCompleteMission(mission);
        setMissionStatus('idle');
        setSelectedOption(null);
      }, 1500);
    } else {
      setMissionStatus('wrong');
      setTimeout(() => setMissionStatus('idle'), 1500);
    }
  };

  const timeSinceClaim = lastFaucetClaim ? (Date.now() - lastFaucetClaim) : Infinity;
  const isFaucetAvailable = timeSinceClaim > 24 * 60 * 60 * 1000;

  return (
    <div className="fixed inset-0 bg-black/90 z-[120] flex justify-center items-center backdrop-blur-xl p-4">
      <div className="bg-slate-900 rounded-[3rem] border border-purple-500/20 w-full max-w-4xl shadow-[0_0_100px_rgba(188,19,254,0.15)] overflow-hidden flex flex-col h-auto max-h-[90vh]">
        <div className="p-8 border-b border-slate-800/50 flex justify-between items-center bg-slate-950/50">
          <div>
            <h2 className="text-3xl font-black font-space-grotesk text-white tracking-tighter uppercase italic flex items-center">
              <GiftIcon className="h-8 w-8 text-purple-400 mr-4" />
              Earn Protocol
            </h2>
            <p className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.4em] mt-1">Capital Accumulation Gateway</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800 rounded-xl">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Faucet Card */}
            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 group hover:border-cyan-500/30 transition-all">
                <div className="flex items-center space-x-3 mb-4">
                    <CurrencyDollarIcon className="h-6 w-6 text-cyan-400" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-sm">Energy Reclaim</h3>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Collect daily liquidity gas from the Aura Protocol. Available once every 24 hours to fuel your initial bot deployments.
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-500 font-bold">REWARD: 50.00 USDT</span>
                    <button 
                        onClick={onClaimFaucet}
                        disabled={!isFaucetAvailable}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isFaucetAvailable ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                    >
                        {isFaucetAvailable ? 'Claim Reclaim' : 'Recharging...'}
                    </button>
                </div>
            </div>

            {/* Refer-A-Node Card */}
            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 group hover:border-purple-500/30 transition-all">
                <div className="flex items-center space-x-3 mb-4">
                    <SparklesIcon className="h-6 w-6 text-purple-400" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-sm">Referral Pipeline</h3>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Establish a sub-node network. Earn a 10% commission on the $AURA rewards accumulated by your referred agents.
                </p>
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 ml-2">AURA-X99-PROMO</span>
                    <button className="text-[9px] font-bold text-purple-400 uppercase hover:text-white transition-colors px-3 py-1.5 bg-purple-500/10 rounded-lg">Copy Link</button>
                </div>
            </div>
          </div>

          {/* AI Learn & Earn Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <AcademicCapIcon className="h-6 w-6 text-yellow-400" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-sm">Neural Calibration Mission</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-600 italic">Powered by Gemini AI Engine</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden">
                {isMissionLoading ? (
                    <div className="py-12 flex flex-col items-center space-y-4">
                        <div className="h-10 w-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest animate-pulse">Scanning Global Ledgers...</p>
                    </div>
                ) : mission ? (
                    <div className="space-y-8">
                        <h4 className="text-lg font-space-grotesk text-white font-bold leading-tight">
                            {mission.question}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mission.options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedOption(i)}
                                    className={`text-left p-4 rounded-2xl border transition-all text-xs font-mono ${
                                        selectedOption === i 
                                        ? 'bg-yellow-400/20 border-yellow-400 text-white' 
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                                >
                                    <span className="text-yellow-400 mr-2 font-black">{String.fromCharCode(65 + i)}.</span>
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Potential Yield</span>
                                <span className="text-sm font-mono font-black text-yellow-400">{mission.reward} $AURA</span>
                            </div>
                            <button
                                onClick={handleMissionSubmit}
                                disabled={selectedOption === null || missionStatus !== 'idle'}
                                className={`px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                    missionStatus === 'correct' ? 'bg-green-500 text-white' :
                                    missionStatus === 'wrong' ? 'bg-red-500 text-white' :
                                    'bg-white text-slate-950 hover:bg-yellow-400'
                                } disabled:opacity-50`}
                            >
                                {missionStatus === 'correct' ? 'Success!' : missionStatus === 'wrong' ? 'System Error' : 'Transmit Solution'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-slate-500 text-sm font-mono italic">No active missions in queue.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};