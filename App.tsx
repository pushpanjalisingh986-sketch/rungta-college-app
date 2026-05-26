
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VoiceAssistant from './components/VoiceAssistant';
import NotificationOverlay from './components/NotificationOverlay';
import VerificationPortal from './components/VerificationPortal';
import { User, Section, UserRole, TacticalNotification, VerificationRequest, AttendanceRecord } from './types';
import { SECTIONS } from './constants';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [sections, setSections] = useState<Section[]>(SECTIONS);
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState<'LIVE' | 'HISTORY' | 'SECURITY' | 'REPORT' | 'REGISTRY'>('REPORT');
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);
  const [notifications, setNotifications] = useState<TacticalNotification[]>([]);

  const [history] = useState<AttendanceRecord[]>(() => {
    const records: AttendanceRecord[] = [];
    const now = new Date();
    for (let i = 0; i < 40; i++) {
      const pastDate = new Date();
      pastDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
      const sectionIndex = i % SECTIONS.length;
      const section = SECTIONS[sectionIndex];
      records.push({
        id: `HIST-${i}`,
        sectionId: section.id,
        strength: 30 + Math.floor(Math.random() * 25),
        crId: 'SYSTEM',
        crName: 'Historical_Log',
        facultyName: section.facultyName,
        timestamp: pastDate.toISOString(),
        period: 1 + (i % 7),
        date: pastDate.toISOString().split('T')[0]
      });
    }
    return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  const addNotification = useCallback((title: string, message: string, type: TacticalNotification['type'] = 'UPDATE') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{
      id,
      title,
      message,
      type,
      timestamp: new Date().toISOString()
    }, ...prev].slice(0, 5));

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const handleLoginAttempt = (authenticatedUser: User) => {
    let targetUser = authenticatedUser;
    let foundSection: Section | undefined;
    
    if (authenticatedUser.role === UserRole.CR) {
      foundSection = sections.find(s => s.crs.some(c => c.email.toLowerCase() === authenticatedUser.email.toLowerCase()));
      const crRecord = foundSection?.crs.find(c => c.email.toLowerCase() === authenticatedUser.email.toLowerCase());
      if (crRecord) {
        targetUser = { ...authenticatedUser, phone: crRecord.phone, section: foundSection?.id };
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      addNotification('SECURITY_THREAT', `Verification token dispatched to role: ${targetUser.phone || 'UNKNOWN'}.`, 'ALERT');

      setVerificationRequest({
        user: targetUser,
        method: 'SMS',
        target: targetUser.phone || 'SYSTEM_MAIL',
        code: code
      });
    } else {
      foundSection = sections.find(s => s.facultyName.toUpperCase() === authenticatedUser.name.toUpperCase());
      if (foundSection) {
        targetUser = { ...authenticatedUser, phone: foundSection.facultyPhone };
      }
      setUser(targetUser);
      setIsPending(false);
      addNotification('SESSION_LINK', `HOD IDENTITY VERIFIED. Welcome, ${targetUser.name}.`, 'INFO');
    }
  };

  const finalizeLogin = () => {
    if (!verificationRequest) return;
    const authenticatedUser = verificationRequest.user;
    
    let pendingVerification = false;
    if (authenticatedUser.role === UserRole.CR) {
      const section = sections.find(s => s.id === authenticatedUser.section);
      const crRecord = section?.crs.find(c => c.email.toLowerCase() === authenticatedUser.email.toLowerCase());
      if (!crRecord?.isVerified) {
        pendingVerification = true;
      }
    }
    
    setUser(authenticatedUser);
    setIsPending(pendingVerification);
    setVerificationRequest(null);
    addNotification('SESSION_LINK', pendingVerification ? 'AWAITING HOD AUTHORIZATION' : `Identity handshake successful for ${authenticatedUser.name}.`, pendingVerification ? 'SECURITY' : 'INFO');
  };

  const handleLogout = () => {
    setUser(null);
    setIsPending(false);
    setVerificationRequest(null);
    addNotification('TERMINAL_CLOSED', 'Uplink terminated. Security protocols active.', 'ALERT');
  };

  const handleAddSection = (sectionData: Partial<Section>) => {
    const newSection: Section = {
      id: `SEC-${Date.now()}`,
      name: sectionData.name || "UNNAMED SECTION",
      facultyName: sectionData.facultyName || "ASSIGNMENT PENDING",
      facultyPhone: sectionData.facultyPhone || "N/A",
      facultyPic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sectionData.facultyName}`,
      crs: [],
      currentStrength: 0,
      lastUpdate: new Date().toISOString()
    };
    setSections(prev => [...prev, newSection]);
    addNotification('SYSTEM_EXPANSION', `New Section initialized: ${newSection.name}`, 'UPDATE');
  };

  const handleRenameSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, ...updates } : s));
    addNotification('METRIC_RECALIBRATION', `Section updated: ${updates.name || 'Parameters updated'}`, 'INFO');
  };

  const handleRemoveSection = (sectionId: string) => {
    const sectionName = sections.find(s => s.id === sectionId)?.name;
    setSections(prev => prev.filter(s => s.id !== sectionId));
    addNotification('SECTION_PURGE', `Section ${sectionName} decommissioned from grid.`, 'ALERT');
  };

  const handleAddCR = (sectionId: string, crData: any) => {
    const updated = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          crs: [...s.crs, { 
            ...crData, 
            isVerified: false,
            reliability: 100,
            profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${crData.name}`
          }]
        };
      }
      return s;
    });
    setSections(updated);
    addNotification('REGISTRY_UPDATE', `Added CR ${crData.name} to section ${sections.find(s => s.id === sectionId)?.name}. Authorization required.`, 'INFO');
  };

  const handleRemoveCR = (sectionId: string, email: string) => {
    const updated = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          crs: s.crs.filter(c => c.email !== email)
        };
      }
      return s;
    });
    setSections(updated);
    addNotification('REGISTRY_UPDATE', `Removed CR role ${email} from section registry.`, 'ALERT');
  };

  const handleVerifyCR = (sectionId: string, email: string, verified: boolean) => {
    const updated = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          crs: s.crs.map(c => c.email === email ? { ...c, isVerified: verified } : c)
        };
      }
      return s;
    });
    setSections(updated);
    addNotification('SECURITY_UPDATE', verified ? `Authorized role ${email}` : `Revoked access for role ${email}`, verified ? 'INFO' : 'SECURITY');
  };

  const handleVoiceNavigation = (tab: any, sectionCallsign?: string) => {
    if (tab) {
        let resolvedTab = tab === 'ARCHIVE' ? 'HISTORY' : tab;
        if (resolvedTab === 'DIRECTORY') resolvedTab = 'REGISTRY';
        setActiveTab(resolvedTab);
    }
    if (sectionCallsign) {
      const section = sections.find(s => s.name.toUpperCase() === sectionCallsign.toUpperCase());
      if (section) {
        setTargetSectionId(section.id);
        addNotification('DEEP_LINK', `Focussing Section: ${section.name}`, 'INFO');
      }
    }
  };

  const handleVoiceStrengthUpdate = (sectionId: string, strength: number) => {
    const updated = sections.map(s => s.id === sectionId ? { ...s, currentStrength: strength, lastUpdate: new Date().toISOString() } : s);
    setSections(updated);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  if (verificationRequest) {
    return (
      <>
        <VerificationPortal request={verificationRequest} onVerify={finalizeLogin} onCancel={() => setVerificationRequest(null)} />
        <NotificationOverlay notifications={notifications} onRemove={removeNotification} />
      </>
    );
  }

  if (isPending && user) {
    return (
      <div className="min-h-screen bg-[#050b18] flex items-center justify-center p-6 blueprint-bg overflow-hidden relative">
        <div className="max-w-2xl w-full glass-blueprint rounded-[3rem] p-16 text-center border-red-500/40 relative z-10 shadow-[0_0_80px_rgba(239,68,68,0.15)] animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-red-500/10 rounded-full border-2 border-red-500/30 flex items-center justify-center mx-auto mb-10">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h2 className="text-5xl font-brand font-black text-white uppercase tracking-tighter mb-6">Access Quarantined</h2>
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 mb-12">
            <p className="text-red-500 font-mono-tech text-xs tracking-[0.4em] uppercase font-bold mb-4">Pending HOD Authorization</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Neural signature for role <span className="text-white font-bold">{user.email}</span> detected but unauthorized. 
              Class Representative status requires manual verification by the Faculty Head (HOD).
            </p>
          </div>
          <button onClick={handleLogout} className="w-full bg-slate-900 border-2 border-white/10 text-white py-5 rounded-2xl font-mono-tech uppercase tracking-widest text-xs hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             Terminate Uplink
          </button>
        </div>
        <NotificationOverlay notifications={notifications} onRemove={removeNotification} />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login onLogin={handleLoginAttempt} />
        <NotificationOverlay notifications={notifications} onRemove={removeNotification} />
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050b18] text-slate-200 blueprint-bg">
      <div className="fixed inset-0 pointer-events-none blueprint-bg-fine opacity-30 z-0"></div>
      <div className="relative z-10">
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          sections={sections} 
          onAddSection={handleAddSection}
          onRenameSection={handleRenameSection}
          onRemoveSection={handleRemoveSection}
          onUpdateSections={setSections} 
          onUpdateUser={setUser}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          targetSectionId={targetSectionId}
          onAddCR={handleAddCR}
          onRemoveCR={handleRemoveCR}
          onVerifyCR={handleVerifyCR}
          history={history}
        />
        <VoiceAssistant 
          user={user} 
          sections={sections} 
          history={history}
          onNavigate={handleVoiceNavigation} 
          onUpdateSection={handleVoiceStrengthUpdate} 
        />
        <NotificationOverlay notifications={notifications} onRemove={removeNotification} />
      </div>
    </div>
  );
};

export default App;
