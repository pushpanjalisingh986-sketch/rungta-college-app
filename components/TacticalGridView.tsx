
import React, { useState, useEffect } from 'react';
import { Section } from '../types';

interface TacticalGridViewProps {
  sections: Section[];
  targetSectionId?: string | null;
}

const TacticalGridView: React.FC<TacticalGridViewProps> = ({ sections, targetSectionId }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [hoveredSection, setHoveredSection] = useState<Section | null>(sections[0] || null);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (targetSectionId) {
      const target = sections.find(s => s.id === targetSectionId);
      if (target) setHoveredSection(target);
    }
  }, [targetSectionId, sections]);

  useEffect(() => {
    if (!isScanning) return;
    let frame: number;
    const speed = 0.001;
    const animate = () => {
      setScanProgress((prev) => (prev + speed) % 1);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isScanning]);

  const getPerformanceMetrics = (reliability: number = 0) => {
    const stars = Math.round(reliability / 20);
    if (reliability >= 90) return { label: 'ELITE', color: 'text-emerald-400', bg: 'bg-emerald-500/10', stars, percentColor: 'text-emerald-500' };
    return { label: 'OPERATIVE', color: 'text-cyan-400', bg: 'bg-cyan-500/10', stars, percentColor: 'text-cyan-500' };
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex space-x-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"} className={`w-2.5 h-2.5 ${i < rating ? 'text-yellow-500' : 'text-slate-700'}`} stroke="currentColor" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
      ))}
    </div>
  );

  return (
    <div className="relative h-[calc(100vh-280px)] w-full bg-[#010409]/95 rounded-[2rem] border border-white/10 flex overflow-hidden shadow-2xl">
      <div className="w-[280px] h-full border-r border-white/5 bg-black/40 flex flex-col z-20">
        <div className="p-5 border-b border-white/5 bg-white/5"><p className="text-[9px] font-mono-tech font-black text-cyan-400 uppercase tracking-widest">Section List</p></div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {sections.map((section) => (
            <div key={section.id} onMouseEnter={() => setHoveredSection(section)} className={`relative cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${hoveredSection?.id === section.id ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:bg-white/5'}`}>
              <p className={`text-[12px] font-brand font-black uppercase tracking-tight ${hoveredSection?.id === section.id ? 'text-white' : 'text-slate-500'}`}>{section.name}</p>
              <span className={`text-[10px] font-mono-tech font-bold ${hoveredSection?.id === section.id ? 'text-cyan-400' : 'text-slate-700'}`}>{section.currentStrength}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 h-full relative flex flex-col overflow-hidden">
        {isScanning && <div className="absolute left-0 right-0 h-[1px] bg-cyan-400/20 z-10 pointer-events-none" style={{ top: `${scanProgress * 100}%` }} />}
        {hoveredSection ? (
          <div className="flex-1 flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-300 relative z-20">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
              <div><span className="text-slate-600 font-mono-tech text-[9px] uppercase font-bold tracking-[0.3em]">Protocol Active</span><h3 className="text-6xl font-brand font-black text-white uppercase tracking-tighter mt-2">{hoveredSection.name}</h3></div>
              <div className="text-right"><p className="text-2xl font-mono-tech text-white font-black">{new Date(hoveredSection.lastUpdate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p></div>
            </div>
            <div className="grid grid-cols-12 gap-8">
               <div className="col-span-12 lg:col-span-9 space-y-8">
                  <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex items-center space-x-8">
                    <img src={hoveredSection.facultyPic} className="w-24 h-24 rounded-2xl object-cover border border-white/10" alt="" />
                    <div className="flex-1">
                      <p className="text-[10px] font-mono-tech text-cyan-500 uppercase font-black tracking-widest mb-1">Guardian</p>
                      <h4 className="text-3xl font-brand font-black text-white uppercase">{hoveredSection.facultyName}</h4>
                      <div className="flex items-center space-x-4 mt-2">
                         <a href={`tel:${hoveredSection.facultyPhone}`} className="px-4 py-1.5 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-[10px] font-mono-tech text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all uppercase tracking-widest">Call Primary</a>
                         <span className="text-white/5 text-xl font-thin">/</span>
                         <span className="text-[10px] font-mono-tech text-slate-500 uppercase">{hoveredSection.facultyPhone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8"><div className="bg-slate-950 p-8 rounded-3xl border border-white/5 flex flex-col justify-between min-h-[160px]"><p className="text-[10px] font-mono-tech text-slate-500 uppercase font-black">Attendance</p><span className="text-7xl font-mono-tech font-black text-white leading-none">{hoveredSection.currentStrength}</span></div></div>
               </div>
               <div className="col-span-12 lg:col-span-3 space-y-4">
                  <h4 className="text-[10px] font-mono-tech font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Roles Registry</h4>
                  {hoveredSection.crs.map((cr, i) => {
                    const metrics = getPerformanceMetrics(cr.reliability);
                    return (
                      <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 group/cr">
                        <div className="flex items-center space-x-3">
                          <img src={cr.profilePic} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[12px] font-brand font-black text-white truncate uppercase">{cr.name}</h5>
                            <div className="flex items-center justify-between mb-1"><StarRating rating={metrics.stars} /><span className={`text-[11px] font-mono-tech font-black ${metrics.percentColor}`}>{cr.reliability || 0}%</span></div>
                            <div className="flex items-center space-x-3 opacity-0 group-hover/cr:opacity-100 transition-opacity">
                               <a href={`tel:${cr.phone}`} title="Call Role" className="text-cyan-500 hover:text-white transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                               </a>
                               <a href={`mailto:${cr.email}`} title="Email Role" className="text-cyan-500 hover:text-white transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                               </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        ) : <div className="flex-1 flex items-center justify-center opacity-10"><h3 className="text-2xl font-mono-tech font-black text-cyan-400 uppercase tracking-[1em]">Scanning</h3></div>}
      </div>
    </div>
  );
};

export default TacticalGridView;
