
import React, { useState, useEffect } from 'react';
import { VerificationRequest } from '../types';

interface VerificationPortalProps {
  request: VerificationRequest;
  onVerify: () => void;
  onCancel: () => void;
}

const VerificationPortal: React.FC<VerificationPortalProps> = ({ request, onVerify, onCancel }) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === request.code) {
      onVerify();
    } else {
      setError('INVALID AUTHENTICATION TOKEN. ACCESS DENIED.');
    }
  };

  const maskString = (str: string) => {
    if (str.includes('@')) {
      const [name, domain] = str.split('@');
      return `${name[0]}***@${domain}`;
    }
    return `+91 ******${str.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#050b18] flex items-center justify-center p-6 blueprint-bg overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.1)_0%,transparent_70%)]"></div>
      
      <div className="max-w-md w-full glass-blueprint rounded-[3rem] p-10 border-red-500/30 relative z-10 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-500/10 rounded-full border-2 border-red-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-brand font-black text-white uppercase tracking-tighter">Identity Handshake</h2>
          <p className="text-slate-400 font-mono-tech text-[10px] mt-2 tracking-[0.2em] uppercase">2FA Protocol Initialized</p>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8">
          <p className="text-white/60 font-mono-tech text-[11px] leading-relaxed text-center mb-4">
            A verification token has been dispatched to your registered {request.method === 'SMS' ? 'mobile node' : 'neural mail'}:
            <br />
            <span className="text-red-500 font-black tracking-widest mt-2 block">{maskString(request.target)}</span>
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              autoFocus
              maxLength={6}
              placeholder="000000"
              className="w-full bg-slate-900/50 border border-red-500/30 rounded-xl px-6 py-4 text-center text-3xl font-mono-tech text-white tracking-[0.5em] focus:outline-none focus:border-red-500 transition-all placeholder-slate-800"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
            />
            {error && <p className="text-red-500 font-mono-tech text-[9px] text-center uppercase tracking-widest animate-bounce">{error}</p>}
            
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-mono-tech font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)]"
            >
              Verify Uplink
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest">
            Handshake expires in: <span className="text-red-500 font-black">{timeLeft}s</span>
          </div>
          <button 
            onClick={onCancel}
            className="text-[10px] font-mono-tech text-slate-600 hover:text-white uppercase tracking-widest transition-all"
          >
            Abort Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPortal;
