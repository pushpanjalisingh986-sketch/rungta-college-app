
import React from 'react';
import { TacticalNotification } from '../types';

interface NotificationOverlayProps {
  notifications: TacticalNotification[];
  onRemove: (id: string) => void;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 w-80 pointer-events-none">
      {notifications.map((notif) => (
        <div 
          key={notif.id}
          className="pointer-events-auto glass-blueprint p-4 rounded-2xl border-l-4 border-l-cyan-500 animate-in slide-in-from-right duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-mono-tech font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                {notif.title}
              </span>
              <button 
                onClick={() => onRemove(notif.id)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-[12px] text-white font-medium leading-tight mb-2">
              {notif.message}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-mono-tech text-slate-500 uppercase">Neural_Broadcasting</span>
              <span className="text-[8px] font-mono-tech text-cyan-500/40">{new Date(notif.timestamp).toLocaleTimeString([], { hour12: false })}</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-[1px] bg-cyan-500 w-full animate-[notifProgress_5s_linear_forwards]"></div>
        </div>
      ))}
      <style>{`
        @keyframes notifProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationOverlay;
