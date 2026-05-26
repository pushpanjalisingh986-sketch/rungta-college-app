
import React, { useState, useEffect } from 'react';
import { AttendanceRecord, Section } from '../types';

interface HistoricalArchiveProps {
  history: AttendanceRecord[];
  sections: Section[];
}

const HistoricalArchive: React.FC<HistoricalArchiveProps> = ({ history, sections }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  const getSectionName = (id: string) => sections.find(s => s.id === id)?.name || id;

  return (
    <div className="space-y-12">
      {/* Real-time Temporal Header */}
      <div className="glass-blueprint p-8 rounded-[2rem] border-2 border-cyan-400/20 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-cyan-950/20 to-transparent">
        <div className="flex items-center space-x-6">
           <div className="bg-cyan-500/10 p-5 rounded-2xl border-2 border-cyan-500/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
           </div>
           <div>
             <h2 className="text-3xl font-brand font-black text-white tracking-tighter uppercase">Chronological Uplink</h2>
             <p className="text-[10px] font-mono-tech text-cyan-400 tracking-[0.5em] uppercase font-bold">Synchronized Temporal Data Stream</p>
           </div>
        </div>
        
        <div className="mt-8 md:mt-0 text-right p-6 bg-slate-950/60 rounded-3xl border border-white/5 min-w-[300px] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <p className="text-[11px] font-mono-tech text-cyan-400 uppercase font-black tracking-widest mb-2">Real-Time Core Time</p>
            <div className="text-4xl font-mono-tech font-black text-white leading-none">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="mt-2 text-[12px] font-mono-tech text-slate-400 uppercase tracking-widest">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
          <h2 className="text-[12px] uppercase font-mono-tech font-black tracking-[0.8em] text-cyan-500/80">Historical_Data_Log [6_MONTHS]</h2>
          <div className="h-[1px] flex-1 ml-10 bg-gradient-to-r from-cyan-500/40 to-transparent"></div>
      </div>

      {/* Timeline List */}
      <div className="grid grid-cols-1 gap-6">
        {history.map((record, index) => {
          const { day, date, time } = formatDate(record.timestamp);
          return (
            <div 
              key={record.id} 
              className="glass-blueprint p-6 rounded-3xl border border-white/10 hover:border-cyan-400/40 transition-all group flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Vertical Date/Day Indicator - High Visibility */}
              <div className="flex flex-col items-center justify-center p-6 bg-cyan-500/10 rounded-2xl border-2 border-cyan-400/20 min-w-[140px] group-hover:bg-cyan-500/20 transition-all">
                <span className="text-cyan-400 font-mono-tech text-[10px] font-black tracking-widest mb-1">{day}</span>
                <span className="text-white font-brand font-black text-2xl leading-none">{date.split(',')[0]}</span>
                <span className="text-slate-500 font-mono-tech text-[10px] mt-1">{date.split(',')[1]}</span>
              </div>

              {/* Data Content */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
                <div className="flex flex-col justify-center">
                   <p className="text-[10px] font-mono-tech uppercase text-slate-500 tracking-widest mb-1">Time_Recorded</p>
                   <p className="text-xl font-mono-tech font-black text-white">{time}</p>
                </div>
                
                <div className="flex flex-col justify-center">
                   <p className="text-[10px] font-mono-tech uppercase text-slate-500 tracking-widest mb-1">Sector_ID</p>
                   <p className="text-xl font-brand font-black text-cyan-400">{getSectionName(record.sectionId)}</p>
                </div>

                <div className="flex flex-col justify-center">
                   <p className="text-[10px] font-mono-tech uppercase text-slate-500 tracking-widest mb-1">Reporting_Officer</p>
                   <p className="text-lg font-brand font-bold text-white truncate">{record.crName}</p>
                </div>

                <div className="flex flex-col justify-center items-end pr-8">
                   <p className="text-[10px] font-mono-tech uppercase text-cyan-500 tracking-widest mb-1">Personnel_Sync</p>
                   <p className="text-4xl font-mono-tech font-black text-white leading-none">{record.strength}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                 <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <span className="text-[8px] font-mono-tech text-emerald-400 font-black uppercase tracking-widest">Verified_Sync</span>
                 </div>
              </div>
              
              {/* Background architectural element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>
            </div>
          );
        })}
      </div>

      <div className="text-center py-20 opacity-30">
          <p className="text-[10px] font-mono-tech uppercase tracking-[1em] text-slate-500">End of Temporal Buffer</p>
      </div>
    </div>
  );
};

export default HistoricalArchive;
