
import React, { useState, useMemo } from 'react';
import { Section, User, UserRole } from '../types';

interface CRRegistryProps {
  sections: Section[];
  user: User;
  onAddCR: (sectionId: string, crData: any) => void;
  onRemoveCR: (sectionId: string, email: string) => void;
  onAddSection: (sectionData: Partial<Section>) => void;
  onRenameSection: (sectionId: string, updates: Partial<Section>) => void;
  onRemoveSection: (sectionId: string) => void;
}

const CRRegistry: React.FC<CRRegistryProps> = ({ 
  sections, user, onAddCR, onRemoveCR, onAddSection, onRenameSection, onRemoveSection 
}) => {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  
  const [newCR, setNewCR] = useState({ name: '', email: '', phone: '', sectionId: '' });
  const [newSection, setNewSection] = useState({ name: '', facultyName: '', facultyPhone: '' });
  const [editSectionData, setEditSectionData] = useState({ name: '', facultyName: '', facultyPhone: '' });

  const filteredSections = useMemo(() => {
    if (!search) return sections;
    return sections.map(section => ({
      ...section,
      crs: section.crs.filter(cr => 
        cr.name.toLowerCase().includes(search.toLowerCase()) ||
        cr.email.toLowerCase().includes(search.toLowerCase()) ||
        section.name.toLowerCase().includes(search.toLowerCase())
      )
    })).filter(section => section.crs.length > 0 || section.name.toLowerCase().includes(search.toLowerCase()));
  }, [sections, search]);

  const handleAddCRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCR.sectionId || !newCR.name || !newCR.email) return;
    onAddCR(newCR.sectionId, {
      name: newCR.name,
      email: newCR.email,
      phone: newCR.phone || 'N/A'
    });
    setNewCR({ name: '', email: '', phone: '', sectionId: '' });
    setShowAddForm(false);
  };

  const handleAddSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.name) return;
    onAddSection(newSection);
    setNewSection({ name: '', facultyName: '', facultyPhone: '' });
    setShowAddSectionForm(false);
  };

  const startEditSection = (section: Section) => {
    setEditingSectionId(section.id);
    setEditSectionData({ 
      name: section.name, 
      facultyName: section.facultyName, 
      facultyPhone: section.facultyPhone 
    });
  };

  const saveEditSection = () => {
    if (editingSectionId) {
      onRenameSection(editingSectionId, editSectionData);
      setEditingSectionId(null);
    }
  };

  const canManage = user.role === UserRole.FACULTY;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Registry Master Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass-blueprint p-8 rounded-[2rem] border-cyan-500/20">
        <div>
          <h2 className="text-3xl font-brand font-black text-white uppercase tracking-tighter">Personnel Registry</h2>
          <p className="text-[10px] font-mono-tech text-cyan-500 tracking-[0.5em] uppercase font-bold mt-1">Infrastructure & Personnel Core</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="SEARCH SYSTEM..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono-tech text-white uppercase tracking-widest focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          {canManage && (
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAddSectionForm(!showAddSectionForm)}
                className="px-6 py-4 bg-slate-900 border border-cyan-500/30 text-cyan-400 rounded-2xl font-mono-tech font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Section
              </button>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-6 py-4 bg-cyan-600 text-white rounded-2xl font-mono-tech font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-cyan-500 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Role
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section Creation Form */}
      {showAddSectionForm && canManage && (
        <div className="glass-blueprint p-8 rounded-[2rem] border-cyan-500/30 animate-in zoom-in-95 duration-300">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/40"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></div>
              <h3 className="text-sm font-mono-tech font-black text-white uppercase tracking-widest">Section Initialization Protocol</h3>
           </div>
           <form onSubmit={handleAddSectionSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input 
                placeholder="SECTION CALLSIGN (e.g. CS1-14)" 
                value={newSection.name} 
                onChange={e => setNewSection({...newSection, name: e.target.value})}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-tech text-white uppercase focus:border-cyan-500/50"
                required
              />
              <input 
                placeholder="GUARDIAN NAME" 
                value={newSection.facultyName} 
                onChange={e => setNewSection({...newSection, facultyName: e.target.value})}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-tech text-white uppercase focus:border-cyan-500/50"
                required
              />
              <input 
                placeholder="GUARDIAN CONTACT" 
                value={newSection.facultyPhone} 
                onChange={e => setNewSection({...newSection, facultyPhone: e.target.value})}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-tech text-white uppercase focus:border-cyan-500/50"
              />
              <button type="submit" className="bg-cyan-600 text-white rounded-xl font-mono-tech font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 transition-all">Initialize Section</button>
           </form>
        </div>
      )}

      {/* Role Creation Form */}
      {showAddForm && canManage && (
        <div className="glass-blueprint p-8 rounded-[2rem] border-emerald-500/30 animate-in zoom-in-95 duration-300">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/40"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
              <h3 className="text-sm font-mono-tech font-black text-white uppercase tracking-widest">Role Registration Protocol</h3>
           </div>
           <form onSubmit={handleAddCRSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input 
                placeholder="PERSONNEL FULL NAME" 
                value={newCR.name} 
                onChange={e => setNewCR({...newCR, name: e.target.value})}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-tech text-white uppercase focus:border-cyan-500/50"
                required
              />
              <input 
                placeholder="PERSONNEL EMAIL" 
                value={newCR.email} 
                onChange={e => setNewCR({...newCR, email: e.target.value})}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-tech text-white uppercase focus:border-cyan-500/50"
                required
              />
              <input 
                placeholder="CONTACT NUMBER" 
                value={newCR.phone} 
                onChange={e => setNewCR({...newCR, phone: e.target.value})}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-tech text-white uppercase focus:border-cyan-500/50"
              />
              <select 
                value={newCR.sectionId} 
                onChange={e => setNewCR({...newCR, sectionId: e.target.value})}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-tech text-white uppercase focus:border-cyan-500/50"
                required
              >
                <option value="" disabled className="bg-slate-900">ASSIGN SECTION</option>
                {sections.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>)}
              </select>
              <button type="submit" className="bg-emerald-600 text-white rounded-xl font-mono-tech font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all">Authorize Role</button>
           </form>
        </div>
      )}

      {/* Main Registry Body */}
      <div className="space-y-16">
        {filteredSections.map((section) => (
          <div key={section.id} className="space-y-6">
            <div className="flex items-center space-x-4 border-b border-white/5 pb-4 group">
              <div className="w-1.5 h-6 bg-cyan-600 rounded-full shadow-[0_0_10px_rgba(8,145,178,0.5)]"></div>
              
              {editingSectionId === section.id ? (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                  <input 
                    value={editSectionData.name} 
                    onChange={e => setEditSectionData({...editSectionData, name: e.target.value})}
                    className="bg-slate-900 border border-cyan-500/50 rounded px-2 py-1 text-xl font-brand font-black text-white uppercase"
                  />
                  <input 
                    value={editSectionData.facultyName} 
                    onChange={e => setEditSectionData({...editSectionData, facultyName: e.target.value})}
                    placeholder="Guardian"
                    className="bg-slate-900 border border-cyan-500/50 rounded px-2 py-1 text-xs font-mono-tech text-white uppercase"
                  />
                  <button onClick={saveEditSection} className="p-1 text-emerald-500 hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></button>
                  <button onClick={() => setEditingSectionId(null)} className="p-1 text-red-500 hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-brand font-black text-white uppercase tracking-tight">Section: {section.name}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canManage && (
                      <>
                        <button onClick={() => startEditSection(section)} className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors" title="Modify Parameters"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => { if(window.confirm('WARNING: Decommissioning section will purge all associated role data. Proceed?')) onRemoveSection(section.id) }} className="p-1.5 text-slate-500 hover:text-red-500 transition-colors" title="Decommission Section"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </>
                    )}
                  </div>
                </>
              )}
              
              <span className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest ml-auto">{section.crs.length} Roles Identified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {section.crs.length === 0 && (
                <div className="col-span-full border border-dashed border-white/10 rounded-[2rem] p-12 text-center opacity-30">
                  <p className="text-[10px] font-mono-tech uppercase tracking-widest">No Active Roles in Section</p>
                </div>
              )}
              {section.crs.map((cr, idx) => (
                <div 
                  key={idx} 
                  className="glass-blueprint p-6 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/40 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all"></div>
                  
                  <div className="flex items-start space-x-6 relative z-10">
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl group-hover:border-cyan-500/40 transition-all">
                        <img src={cr.profilePic} className="w-full h-full object-cover" alt={cr.name} />
                      </div>
                      <div className={`absolute -bottom-2 -right-2 ${cr.isVerified ? 'bg-cyan-600' : 'bg-amber-600'} text-white text-[8px] font-mono-tech font-black px-2 py-1 rounded-lg border border-white/20 shadow-lg uppercase`}>
                        {cr.isVerified ? 'ACTIVE' : 'PENDING'}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h3 className="text-lg font-brand font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors truncate">{cr.name}</h3>
                          <p className="text-[9px] font-mono-tech text-cyan-500 font-black uppercase tracking-widest">{section.name} Section</p>
                        </div>
                        {canManage && (
                          <button 
                            onClick={() => onRemoveCR(section.id, cr.email)}
                            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                            title="Decommission Role"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="mt-4 space-y-3">
                        <a href={`tel:${cr.phone}`} className="flex items-center space-x-3 text-slate-400 hover:text-cyan-400 transition-all group/link">
                          <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 group-hover/link:border-cyan-500/50 group-hover/link:bg-cyan-500/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <span className="text-[11px] font-mono-tech tracking-wider">{cr.phone}</span>
                        </a>

                        <a href={`mailto:${cr.email}`} className="flex items-center space-x-3 text-slate-400 hover:text-cyan-400 transition-all group/link">
                          <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 group-hover/link:border-cyan-500/50 group-hover/link:bg-cyan-500/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-[11px] font-mono-tech tracking-tight truncate">{cr.email}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 pt-6 border-t border-white/5">
                    <div className="flex-1 bg-cyan-500/5 rounded-xl p-3 border border-cyan-500/10">
                      <p className="text-[8px] font-mono-tech text-slate-500 uppercase font-black mb-1">Guardian</p>
                      <p className="text-[10px] font-brand font-bold text-white uppercase truncate">{section.facultyName}</p>
                    </div>
                    <div className="flex-1 bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10 text-right">
                      <p className="text-[8px] font-mono-tech text-slate-500 uppercase font-black mb-1">Reliability Index</p>
                      <p className="text-[10px] font-mono-tech font-black text-emerald-400 uppercase">{cr.reliability}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="py-20 text-center opacity-30">
          <p className="text-xl font-mono-tech uppercase tracking-[0.5em] text-slate-500">No Matching Infrastructure Identified</p>
        </div>
      )}
    </div>
  );
};

export default CRRegistry;
