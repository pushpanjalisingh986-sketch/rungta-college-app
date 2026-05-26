
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Section, ChatMessage, AttendanceRecord, UserRole, Conversation } from '../types';
import ChatBox from './ChatBox';
import HistoryView from './HistoryView';
import TacticalGridView from './TacticalGridView';
import CRRegistry from './CRRegistry';
import SecurityPortal from './SecurityPortal';
import { getSmartSummary } from '../services/gemini';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  sections: Section[];
  onAddSection: (sectionData: Partial<Section>) => void;
  onRenameSection: (sectionId: string, updates: Partial<Section>) => void;
  onRemoveSection: (sectionId: string) => void;
  onUpdateSections: (sections: Section[]) => void;
  onUpdateUser: (user: User) => void;
  activeTab: 'LIVE' | 'HISTORY' | 'SECURITY' | 'REPORT' | 'REGISTRY';
  onTabChange: (tab: any) => void;
  targetSectionId?: string | null;
  onAddCR: (sectionId: string, crData: any) => void;
  onRemoveCR: (sectionId: string, email: string) => void;
  onVerifyCR: (sectionId: string, email: string, verified: boolean) => void;
  history: AttendanceRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, onLogout, sections, onAddSection, onRenameSection, onRemoveSection, onUpdateSections, onUpdateUser, 
  activeTab, onTabChange, targetSectionId, onAddCR, onRemoveCR, onVerifyCR, history
}) => {
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, ChatMessage[]>>({});
  const [chatSearch, setChatSearch] = useState('');
  const [summary, setSummary] = useState("Initializing neural summary...");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (targetSectionId) {
      if (activeTab === 'LIVE') {
        setActiveConversationId(targetSectionId);
      }
    }
  }, [targetSectionId, activeTab]);

  useEffect(() => {
    if (activeConversationId) {
      setMessagesByConversation(prev => {
        const convoMessages = prev[activeConversationId] || [];
        const hasUnseen = convoMessages.some(m => m.senderId !== user.id && m.status !== 'seen');
        if (!hasUnseen) return prev;
        return {
          ...prev,
          [activeConversationId]: convoMessages.map(m => 
            m.senderId !== user.id ? { ...m, status: 'seen' } : m
          )
        };
      });
    }
  }, [activeConversationId, user.id]);

  const conversations = useMemo(() => {
    const list: Conversation[] = [];
    sections.forEach(s => {
      if (user.role === UserRole.FACULTY || user.section === s.id) {
        const msgs = messagesByConversation[s.id] || [];
        const unreadCount = msgs.filter(m => m.senderId !== user.id && m.status !== 'seen').length;
        list.push({
          id: s.id,
          name: `${s.name} Section Group`,
          type: 'GROUP',
          participants: s.crs.map(c => c.email).concat([s.facultyName]),
          icon: s.facultyPic,
          unreadCount
        });
      }
    });
    return list;
  }, [sections, user, messagesByConversation]);

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  useEffect(() => {
    const fetchSummary = async () => {
        const s = await getSmartSummary(sections);
        setSummary(s);
    }
    fetchSummary();
  }, [sections]);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateUser({ ...user, profilePic: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!activeConversationId) return;
    const messageId = Date.now().toString();
    const newMsg: ChatMessage = {
      id: messageId,
      conversationId: activeConversationId,
      senderId: user.id,
      senderName: user.name,
      senderPic: user.profilePic,
      text,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };
    setMessagesByConversation(prev => ({ ...prev, [activeConversationId]: [...(prev[activeConversationId] || []), newMsg] }));
  };

  const currentConvo = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="min-h-screen p-6 lg:p-10 space-y-10 max-w-[1900px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-cyan-500/10 pb-8">
        <div className="flex items-center space-x-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-20 h-20 rounded-2xl border-2 border-cyan-500/20 overflow-hidden shadow-xl group-hover:border-cyan-400/50 transition-all">
              {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-slate-900 flex items-center justify-center text-cyan-500/20"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfilePicChange} />
          </div>
          <div>
            <h1 className="text-4xl font-brand font-black text-white tracking-tight uppercase">{user.name}</h1>
            <p className="text-cyan-500 font-mono-tech text-xs uppercase tracking-widest mt-1 opacity-60">{user.role} Authorization Active</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden xl:block bg-cyan-500/5 border border-cyan-500/10 px-4 py-2 rounded-xl max-w-xs">
            <p className="text-white font-mono-tech text-[10px] uppercase truncate">{summary}</p>
          </div>
          <button onClick={onLogout} className="px-6 py-3 border border-red-500/20 rounded-xl hover:bg-red-500/5 text-red-500 font-mono-tech font-bold uppercase tracking-widest text-[10px] transition-all">Terminal Shutdown</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
         {['REPORT', 'LIVE', 'HISTORY', 'REGISTRY', 'SECURITY'].map((tab) => (
           ((tab !== 'SECURITY' && tab !== 'REGISTRY') || user.role === UserRole.FACULTY) && (
             <button key={tab} onClick={() => onTabChange(tab as any)} className={`px-5 py-2 rounded-lg font-mono-tech text-[10px] tracking-widest transition-all uppercase font-bold ${activeTab === tab ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/20'}`}>
               {tab === 'LIVE' ? 'COMMUNICATIONS' : tab === 'REGISTRY' ? 'PERSONNEL REGISTRY' : tab === 'SECURITY' ? 'SECURITY PORTAL' : tab}
             </button>
           )
         ))}
      </div>

      <div className="flex-1">
        {activeTab === 'REPORT' && <TacticalGridView sections={sections} targetSectionId={targetSectionId} />}
        {activeTab === 'LIVE' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[750px] animate-in fade-in slide-in-from-bottom duration-500">
            <div className="xl:col-span-4 glass-blueprint rounded-[2rem] border border-white/10 flex flex-col overflow-hidden">
               <div className="p-6 border-b border-white/5 space-y-4">
                  <h3 className="text-lg font-brand font-black text-white uppercase tracking-tight">Active Channels</h3>
                  <input type="text" placeholder="SEARCH HANDSHAKES..." value={chatSearch} onChange={(e) => setChatSearch(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-mono-tech text-white uppercase tracking-widest focus:outline-none focus:border-cyan-500/30" />
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                 {conversations.filter(c => c.name.toLowerCase().includes(chatSearch.toLowerCase())).map((convo) => (
                   <button key={convo.id} onClick={() => setActiveConversationId(convo.id)} className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all group relative ${activeConversationId === convo.id ? 'bg-cyan-600 shadow-lg' : 'hover:bg-white/5'}`}>
                     <img src={convo.icon} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="" />
                     <div className="flex-1 text-left min-w-0">
                        <h4 className={`text-xs font-brand font-black uppercase truncate ${activeConversationId === convo.id ? 'text-white' : 'text-slate-200'}`}>{convo.name}</h4>
                     </div>
                   </button>
                 ))}
               </div>
            </div>
            <div className="xl:col-span-8 flex flex-col h-full">
               {currentConvo ? <ChatBox user={user} conversationName={currentConvo.name} messages={messagesByConversation[activeConversationId] || []} onSendMessage={handleSendMessage} /> : <div className="flex-1 glass-blueprint rounded-[2rem] border border-white/10 flex items-center justify-center"><p className="text-slate-500 font-mono-tech uppercase tracking-widest">Select Stream</p></div>}
            </div>
          </div>
        )}
        {activeTab === 'REGISTRY' && (
          <CRRegistry 
            sections={sections} 
            user={user} 
            onAddCR={onAddCR} 
            onRemoveCR={onRemoveCR} 
            onAddSection={onAddSection}
            onRenameSection={onRenameSection}
            onRemoveSection={onRemoveSection}
          />
        )}
        {activeTab === 'SECURITY' && user.role === UserRole.FACULTY && <SecurityPortal sections={sections} user={user} onVerifyCR={onVerifyCR} />}
        {activeTab === 'HISTORY' && <HistoryView history={history} sections={sections} />}
      </div>
    </div>
  );
};

export default Dashboard;
