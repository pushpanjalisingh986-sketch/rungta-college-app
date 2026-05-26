
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'tactical' | 'university';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'tactical' }) => {
  const scale = {
    sm: 'scale-[0.4] origin-left',
    md: 'scale-[0.6] origin-center',
    lg: 'scale-[0.8] origin-center',
    xl: 'scale-100 origin-center',
  }[size];

  if (variant === 'university') {
    return (
      <div className={`flex items-center space-x-6 bg-transparent ${className} ${scale}`}>
        {/* Vectorized University Icon */}
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            {/* Main Red Oval */}
            <path 
              d="M10,50 Q10,20 50,20 Q90,20 90,50 Q90,80 50,80 Q10,80 10,50" 
              fill="#E11D48" 
              className="animate-pulse"
            />
            {/* White Stylized Figure */}
            <path 
              d="M35,65 Q45,35 65,35 Q55,65 45,75 Z" 
              fill="white" 
            />
            <path 
              d="M60,45 Q50,45 45,35 Q60,25 70,40" 
              fill="white" 
            />
            {/* Black Dot */}
            <circle cx="65" cy="22" r="6" fill="#0f172a" />
            
            {/* Holographic scanning overlay */}
            <rect x="0" y="0" width="100" height="100" fill="url(#logoScan)" className="opacity-30" />
            <defs>
              <linearGradient id="logoScan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="white" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Professional University Typography */}
        <div className="flex flex-col tracking-tight">
          <div className="text-5xl font-brand font-black text-white leading-[0.9]">RUNGTA</div>
          <div className="my-1.5 bg-red-600 px-3 py-1 inline-block">
            <div className="text-[12px] font-brand font-bold text-white uppercase tracking-[0.15em] whitespace-nowrap">
              INTERNATIONAL SKILLS
            </div>
          </div>
          <div className="text-4xl font-brand font-black text-white leading-[0.9]">UNIVERSITY</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-6 bg-transparent ${className} ${scale}`}>
      {/* Tactical Hologram Graphics */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <div className="absolute inset-0 bg-cyan-500 rounded-3xl flex items-center justify-center transform rotate-45 overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.3)] border-2 border-white/40">
            {/* Inner blueprint detailing */}
            <div className="w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center">
                 <div className="w-6 h-6 border-b-4 border-r-4 border-white rounded-full translate-x-1 translate-y-1"></div>
            </div>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-4 border-[#050b18]"></div>
      </div>

      {/* Modern High-End Typography */}
      <div className="flex flex-col">
        <div className="text-4xl font-brand font-black text-white leading-none tracking-tighter">RUNGTA</div>
        <div className="flex items-center space-x-2 my-1">
          <div className="h-[2px] w-8 bg-cyan-500"></div>
          <div className="text-[11px] font-mono-tech font-bold text-cyan-500 uppercase tracking-[0.4em]">TECH_UNIVERSITY</div>
        </div>
        <div className="text-3xl font-brand font-black text-white/40 leading-none tracking-tight">PORTAL</div>
      </div>
    </div>
  );
};

export default Logo;
