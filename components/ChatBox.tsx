
import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';

interface ChatBoxProps {
  user: User;
  conversationName: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user, conversationName, messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const renderStatus = (status: ChatMessage['status']) => {
    switch (status) {
      case 'sending':
        return <div className="w-2.5 h-2.5 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>;
      case 'sent':
        return (
          <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'delivered':
        return (
          <div className="flex -space-x-1">
            <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'seen':
        return (
          <div className="flex -space-x-1">
            <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full glass-blueprint bg-slate-950/40 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-slate-900/80 p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]"></div>
          <h3 className="text-white font-mono-tech font-black text-sm tracking-widest uppercase">{conversationName}</h3>
        </div>
        <div className="flex items-center space-x-2">
           <span className="text-[8px] font-mono-tech text-cyan-500/40 uppercase tracking-widest">Secure_Uplink_Active</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.855-1.246L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-[10px] uppercase font-mono-tech tracking-widest">Awaiting Communication</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}>
            {msg.isSystem ? (
              <div className="w-full flex justify-center py-2">
                 <span className="text-[9px] font-mono-tech text-cyan-500/40 font-bold uppercase tracking-widest">{msg.text}</span>
              </div>
            ) : (
              <div className={`flex items-end space-x-2 max-w-[85%] ${msg.senderId === user.id ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className="relative flex-shrink-0">
                  <img src={msg.senderPic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderName}`} className="w-8 h-8 rounded-xl object-cover border border-white/10" alt="" />
                  {msg.senderId !== user.id && <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_5px_#10b981]"></div>}
                </div>
                <div className="flex flex-col">
                  {msg.senderId !== user.id && (
                    <span className="text-[9px] font-mono-tech text-slate-500 uppercase font-black mb-1 ml-1">{msg.senderName}</span>
                  )}
                  <div className={`rounded-2xl px-5 py-3 ${
                    msg.senderId === user.id 
                      ? 'bg-cyan-600 text-white rounded-tr-none shadow-[0_4px_15px_rgba(8,145,178,0.2)]' 
                      : 'bg-white/5 text-slate-100 rounded-tl-none border border-white/10'
                  }`}>
                    <p className="text-[13px] font-medium leading-relaxed">{msg.text}</p>
                    <div className={`text-[8px] font-mono-tech mt-1 flex items-center justify-end space-x-1.5 ${msg.senderId === user.id ? 'text-white/40' : 'text-slate-500'}`}>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.senderId === user.id && renderStatus(msg.status)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-900/60 border-t border-white/5">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Neural link to ${conversationName}...`}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 placeholder-slate-600 font-mono-tech"
          />
          <button
            onClick={handleSend}
            className="bg-cyan-600 text-white p-4 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(8,145,178,0.4)]"
            disabled={!inputText.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
