
import React, { useEffect, useState } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    const finishTimer = setTimeout(onFinish, 4000);
    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#020617] z-[100] flex flex-col items-center justify-center p-6">
      {/* Cinematic Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.1)_0%,transparent_70%)]"></div>
      
      <div className={`transition-all duration-1000 transform ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} flex flex-col items-center relative z-10`}>
        <div className="relative">
            {/* Soft Red pulse glow for University Branding */}
            <div className="absolute -inset-24 bg-red-600/10 blur-[100px] rounded-full animate-pulse"></div>
            <Logo size="xl" variant="university" className="relative z-10" />
        </div>
        
        <div className="mt-24 flex flex-col items-center space-y-10">
            {/* Tactical Loading Visuals */}
            <div className="flex space-x-3 items-end h-10">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-red-500/40 animate-[loadingPulse_1s_infinite] rounded-full" 
                    style={{ animationDelay: `${i * 150}ms` }}
                  ></div>
                ))}
            </div>
            
            <div className="flex flex-col items-center w-96">
                <div className="flex justify-between w-full mb-3">
                  <p className="text-red-500 font-mono-tech text-[10px] tracking-[0.5em] uppercase font-bold">Protocol Initialization</p>
                  <p className="text-slate-500 font-mono-tech text-[9px] uppercase">Node::Alpha</p>
                </div>
                <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden backdrop-blur-md border border-white/5 relative">
                    <div className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 w-0 animate-[loadingLine_3.5s_cubic-bezier(0.65,0,0.35,1)_forwards] shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
                    {/* Glossy light effect on loading bar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="mt-4 flex justify-between w-full">
                   <span className="text-[9px] font-mono-tech text-slate-600 uppercase tracking-widest">Biometric_Link</span>
                   <span className="text-[9px] font-mono-tech text-slate-600 uppercase tracking-widest">SECURE_AUTH</span>
                </div>
            </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center space-y-3 opacity-60">
        <div className="flex items-center space-x-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-slate-700"></div>
          <div className="text-slate-400 font-mono-tech text-[10px] tracking-[0.6em] uppercase font-medium">
            Rungta Digital Infrastructure
          </div>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-slate-700"></div>
        </div>
        <div className="text-[8px] font-mono-tech text-red-500/40 uppercase tracking-[1em]">Tactical_OS_v4.1</div>
      </div>

      <style>{`
        @keyframes loadingLine {
          0% { width: 0%; }
          40% { width: 45%; }
          70% { width: 75%; }
          100% { width: 100%; }
        }
        @keyframes loadingPulse {
          0%, 100% { height: 30%; opacity: 0.3; }
          50% { height: 100%; opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
