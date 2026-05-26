
import React, { useMemo } from 'react';
import { Section, User, UserRole } from '../types';

interface SecurityPortalProps {
  sections: Section[];
  user: User;
  onVerifyCR: (sectionId: string, email: string, verified: boolean) => void;
}

const SecurityPortal: React.FC<SecurityPortalProps> = ({ sections, user, onVerifyCR }) => {
  const pendingRequests = useMemo(() => {
    const list: any[] = [];
    sections.forEach(section => {
      section.crs.forEach(cr => {
        if (!cr.isVerified) {
          list.push({
            ...cr,
            sectionId: section.id,
            sectionName: section.name
          });
        }
      });
    });
    return list;
  }, [sections]);

  const allActiveCRs = useMemo(() => {
    const list: any[] = [];
    sections.forEach(section => {
      section.crs.forEach(cr => {
        if (cr.isVerified) {
          list.push({
            ...cr,
            sectionId: section.id,
            sectionName: section.name
          });
        }
      });
    });
    return list;
  }, [sections]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Info */}
      <div className="glass-blueprint p-8 rounded-[2.5rem] border-red-500/20 bg-gradient-to-br from-red-950/10 to-transparent">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border-2 border-red-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-brand font-black text-white uppercase tracking-tighter">Role Security Core</h2>
            <p className="text-[10px] font-mono-tech text-red-500 tracking-[0.5em] uppercase font-bold mt-1">Verification & Access Authorization Protocol</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Pending Requests Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-sm font-mono-tech font-black text-amber-500 uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Access Requests ({pendingRequests.length})
            </h3>
          </div>

          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="glass-blueprint p-12 rounded-[2rem] border-white/5 text-center opacity-30">
                <p className="text-[10px] font-mono-tech uppercase tracking-widest">No Pending Intercepts</p>
              </div>
            ) : (
              pendingRequests.map((cr) => (
                <div key={cr.email} className="glass-blueprint p-6 rounded-[2rem] border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between group">
                  <div className="flex items-center space-x-5">
                    <img src={cr.profilePic} className="w-14 h-14 rounded-xl border border-white/10 grayscale group-hover:grayscale-0 transition-all" alt="" />
                    <div>
                      <h4 className="text-white font-brand font-black uppercase text-lg">{cr.name}</h4>
                      <p className="text-[10px] font-mono-tech text-slate-500 uppercase">{cr.sectionName} Section</p>
                      <div className="flex items-center space-x-3 mt-1">
                         <a href={`tel:${cr.phone}`} className="text-[9px] font-mono-tech text-cyan-500 hover:text-white transition-colors uppercase tracking-widest">Call Role</a>
                         <span className="text-white/10">|</span>
                         <a href={`mailto:${cr.email}`} className="text-[9px] font-mono-tech text-cyan-500 hover:text-white transition-colors uppercase tracking-widest">Email Role</a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => onVerifyCR(cr.sectionId, cr.email, true)}
                      className="px-6 py-3 bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 rounded-xl font-mono-tech font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      Authorize
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Authorized Roles Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-sm font-mono-tech font-black text-cyan-500 uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              Authorized Roles ({allActiveCRs.length})
            </h3>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {allActiveCRs.map((cr) => (
              <div key={cr.email} className="glass-blueprint p-6 rounded-[2rem] border-cyan-500/10 hover:border-cyan-500/30 transition-all flex items-center justify-between group">
                <div className="flex items-center space-x-5">
                  <img src={cr.profilePic} className="w-14 h-14 rounded-xl border border-white/10" alt="" />
                  <div>
                    <h4 className="text-white font-brand font-black uppercase text-lg">{cr.name}</h4>
                    <p className="text-[10px] font-mono-tech text-cyan-500/60 uppercase">{cr.sectionName} Section • {cr.reliability}% RELIABILITY</p>
                    <div className="flex items-center space-x-3 mt-1">
                        <a href={`tel:${cr.phone}`} className="text-[9px] font-mono-tech text-cyan-500/40 hover:text-white transition-colors uppercase tracking-widest">Voice Link</a>
                        <span className="text-white/10">|</span>
                        <a href={`mailto:${cr.email}`} className="text-[9px] font-mono-tech text-cyan-500/40 hover:text-white transition-colors uppercase tracking-widest">Mail Link</a>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onVerifyCR(cr.sectionId, cr.email, false)}
                  className="px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl font-mono-tech font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPortal;
