import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, CpuChipIcon, SparklesIcon } from './Icons';

interface SecurityGatewayProps {
  onAuthenticated: () => void;
}

export const SecurityGateway: React.FC<SecurityGatewayProps> = ({ onAuthenticated }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [useAutoLogin, setUseAutoLogin] = useState(() => localStorage.getItem('aura_auto_login') === 'true');
  const [bioEnabled, setBioEnabled] = useState(() => localStorage.getItem('aura_bio_enabled') === 'true');
  const [step, setStep] = useState<'idle' | 'scanning' | 'granted'>('idle');

  useEffect(() => {
    // Check for existing valid session
    const session = localStorage.getItem('aura_session');
    if (session && useAutoLogin) {
      handleSuccess();
    }
  }, []);

  const handleSuccess = () => {
    setStep('granted');
    setTimeout(() => {
      onAuthenticated();
    }, 800);
  };

  const startScan = () => {
    setIsAuthenticating(true);
    setStep('scanning');
    
    // Simulate biometric processing
    setTimeout(() => {
      const success = true; // In real app, check bio result
      if (success) {
        localStorage.setItem('aura_session', 'active_' + Date.now());
        if (useAutoLogin) localStorage.setItem('aura_auto_login', 'true');
        if (bioEnabled) localStorage.setItem('aura_bio_enabled', 'true');
        handleSuccess();
      } else {
        setIsAuthenticating(false);
        setStep('idle');
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-1000">
        <div className="glass-panel border-cyan-500/20 rounded-[40px] p-10 flex flex-col items-center text-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="mb-8">
            <h1 className="font-space-grotesk text-4xl font-black tracking-tight text-white mb-2 italic">AURA ELITE</h1>
            <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] font-bold">Secure Access Terminal</p>
          </div>

          <div className="relative mb-12 group">
            {/* Visual Scanner Ring */}
            <div className={`absolute inset-0 -m-6 border-2 rounded-full border-cyan-500/20 transition-all duration-1000 ${step === 'scanning' ? 'animate-[ping_1.5s_infinite]' : 'opacity-0'}`} />
            <div className={`absolute inset-0 -m-3 border-2 rounded-full border-cyan-500/10 transition-all duration-700 ${step === 'scanning' ? 'scale-110 opacity-100' : 'scale-100 opacity-0'}`} />
            
            <button
              onClick={startScan}
              disabled={isAuthenticating}
              className={`relative h-36 w-36 rounded-full flex items-center justify-center transition-all duration-500 border-2 overflow-hidden ${
                step === 'granted' ? 'bg-green-500/20 border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)]' :
                step === 'scanning' ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.4)]' :
                'bg-slate-900 border-slate-700 hover:border-cyan-500 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]'
              }`}
            >
              {step === 'scanning' && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[scan_2s_ease-in-out_infinite] z-20" />
              )}
              {step === 'granted' ? (
                <ShieldCheckIcon className="h-16 w-16 text-green-400 animate-in zoom-in-50" />
              ) : (
                <div className="flex flex-col items-center z-10">
                   <CpuChipIcon className={`h-14 w-14 transition-all duration-500 ${step === 'scanning' ? 'text-cyan-400' : 'text-slate-500'}`} />
                   <span className={`text-[9px] font-mono mt-3 font-black tracking-widest ${step === 'scanning' ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {step === 'scanning' ? 'VERIFYING' : 'INITIALIZE'}
                   </span>
                </div>
              )}
            </button>
          </div>

          <div className="w-full space-y-6">
             <div className="flex flex-col space-y-4">
               <label className="flex items-center justify-between cursor-pointer group px-4 py-3 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-center space-x-3 text-left">
                    <SparklesIcon className="h-4 w-4 text-purple-400" />
                    <div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Biometrics</span>
                        <span className="text-[8px] text-slate-500 uppercase font-mono tracking-tight">Facial / Thumb ID</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setBioEnabled(!bioEnabled)}
                    className={`h-5 w-10 rounded-full relative transition-all duration-300 ${bioEnabled ? 'bg-purple-600' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${bioEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
               </label>

               <label className="flex items-center justify-between cursor-pointer group px-4 py-3 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-center space-x-3 text-left">
                    <ShieldCheckIcon className="h-4 w-4 text-cyan-400" />
                    <div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Auto-Sync</span>
                        <span className="text-[8px] text-slate-500 uppercase font-mono tracking-tight">Remember Device</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setUseAutoLogin(!useAutoLogin)}
                    className={`h-5 w-10 rounded-full relative transition-all duration-300 ${useAutoLogin ? 'bg-cyan-600' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${useAutoLogin ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
               </label>
             </div>

             <div className="pt-4">
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] leading-relaxed font-bold opacity-60">
                  Decentralized Auth Node <br />
                  <span className="text-slate-700">v3.1.2 // SECURE_SOCKET_LAYER_V2</span>
                </p>
             </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-[10px] text-slate-600 font-mono animate-pulse tracking-[0.5em] uppercase">
          // Awaiting Handshake
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};