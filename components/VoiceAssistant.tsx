
import React, { useState, useEffect, useRef } from 'react';
import { processAdvancedVoiceCommand } from '../services/gemini';
import { Section, User, UserRole, AttendanceRecord, VoiceLog } from '../types';

interface VoiceAssistantProps {
  user: User;
  sections: Section[];
  history: AttendanceRecord[];
  onNavigate: (tab: any, sectionCallsign?: string) => void;
  onUpdateSection: (sectionId: string, strength: number) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ user, sections, history, onNavigate, onUpdateSection }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [status, setStatus] = useState('RABIT-X v5.3 Secure');
  const [position, setPosition] = useState({ x: 40, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);
  const dragRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const addVoiceLog = (command: string, response: string, intent: string, analysis?: string) => {
    const newLog: VoiceLog = {
      id: Math.random().toString(36).substr(2, 9),
      command,
      response: analysis || response,
      intent,
      timestamp: new Date().toISOString()
    };
    setVoiceLogs(prev => [newLog, ...prev].slice(0, 15));
  };

  const startListening = () => {
    if (isReporting) {
      window.speechSynthesis.cancel();
      setIsReporting(false);
      setStatus('Narration Halted');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (!SpeechRecognition) {
      alert("Neural voice capture not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('LISTENING...');
      setInterimTranscript('');
      speak("Ready.");
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          handleFinalTranscript(event.results[i][0].transcript);
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setIsProcessing(false);
      setStatus('SIGNAL ERROR');
      speak("Retry.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleFinalTranscript = async (transcript: string) => {
    setIsListening(false);
    setIsProcessing(true);
    setStatus('PROCESSING...');
    setInterimTranscript('');
    
    const result = await processAdvancedVoiceCommand(transcript, { sections, history, user });
    setIsProcessing(false);

    addVoiceLog(transcript, result.clarification, result.intent, result.analysisResult);

    if (result.intent === "NAVIGATE" && result.targetTab) {
      onNavigate(result.targetTab, result.targetSubSection);
      speak(result.clarification);
      setStatus(`UPLINK: ${result.targetTab}`);
    } else if (result.intent === "FULL_REPORT") {
      runFullReport();
    } else if (result.intent === "SECTION_REPORT") {
      speak(result.clarification);
      setStatus('DOSSIER OPEN');
      if (result.targetSubSection) onNavigate('REPORT', result.targetSubSection);
      setShowLog(true);
    } else if (result.intent === "UPDATE" && result.updateData) {
      if (user.role === UserRole.CR) {
         const targetId = result.updateData.sectionId || user.section;
         if (targetId) {
           onUpdateSection(targetId, result.updateData.strength);
           speak(result.clarification);
           setStatus('METRICS SYNCED');
         }
      } else {
        speak("Unauthorized.");
      }
    } else {
      speak(result.clarification);
      setStatus('COMPLETE');
      if (result.analysisResult) setShowLog(true);
    }
  };

  const runFullReport = async () => {
    setIsReporting(true);
    setStatus('AUDITING...');
    speak("Syncing university metrics. Commencing readout.");
    for (const section of sections) {
      if (!isReporting) break;
      await speakAsync(`${section.name}: ${section.currentStrength}`);
    }
    setIsReporting(false);
    setStatus('AUDIT DONE');
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.3; // Slightly faster for responsiveness
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const speakAsync = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.3;
      utterance.pitch = 0.9;
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => setIsDragging(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({ x: window.innerWidth - e.clientX - 50, y: window.innerHeight - e.clientY - 50 });
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div ref={dragRef} style={{ right: position.x, bottom: position.y }} className="fixed z-[200] group select-none">
      <div className="flex flex-col items-end">
        {/* Real-time Transcription Overlay */}
        {(interimTranscript || isProcessing) && (
          <div className="mb-4 w-64 glass-blueprint rounded-2xl border border-cyan-500/40 p-4 animate-in slide-in-from-right fade-in shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
              <p className="text-[8px] font-mono-tech text-cyan-500 uppercase tracking-widest font-black">Neural Link Stream</p>
            </div>
            <p className="text-[11px] font-mono-tech text-white leading-relaxed italic opacity-80">
              {isProcessing ? 'Thinking...' : `"${interimTranscript}..."`}
            </p>
          </div>
        )}

        {showLog && (
          <div className="mb-4 w-80 glass-blueprint rounded-[2rem] border-2 border-cyan-500/30 p-6 animate-in slide-in-from-bottom-5 fade-in max-h-[400px] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-5">
               <h4 className="text-[11px] font-mono-tech font-black text-cyan-400 uppercase tracking-[0.3em]">Neural Interface Logs</h4>
               <button onClick={() => setShowLog(false)} className="text-slate-500 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
            </div>
            <div className="space-y-6">
              {voiceLogs.map(log => (
                <div key={log.id} className="relative pl-4 border-l-2 border-cyan-500/20 py-1">
                   <p className="text-[10px] text-cyan-400 font-bold uppercase mb-2 tracking-tighter">>> {log.command}</p>
                   <div className="bg-black/40 p-3 rounded-xl border border-white/5"><p className="text-[11px] text-slate-200 font-mono-tech">{log.response}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4 mb-4">
          <button onClick={() => setShowLog(!showLog)} className={`p-3 glass-blueprint rounded-2xl border transition-all ${showLog ? 'border-cyan-400 bg-cyan-500/10 text-white' : 'border-cyan-500/20 text-cyan-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
          
          <div className={`px-6 py-2.5 glass-blueprint rounded-[1.2rem] border-2 text-[10px] uppercase font-black tracking-[0.25em] whitespace-nowrap transition-all shadow-2xl ${
            isListening ? 'border-red-500 text-red-400 shadow-red-500/20' : isProcessing ? 'border-amber-500 text-amber-400 shadow-amber-500/20' : 'border-cyan-400/40 text-cyan-400'
          } ${isListening || isReporting || isProcessing ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-4 group-hover:scale-100 group-hover:opacity-100'}`}>
            <div className="flex items-center space-x-3"><div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-cyan-500'}`}></div><span>{status}</span></div>
          </div>
        </div>
        
        <button onMouseDown={handleMouseDown} onClick={startListening} className="relative w-32 h-36 transition-all hover:scale-110 active:scale-95 cursor-pointer">
          <div className={`absolute inset-0 bg-cyan-500/10 blur-[50px] rounded-full transition-opacity duration-500 ${isListening || isReporting || isProcessing ? 'opacity-100' : 'opacity-20 group-hover:opacity-60'}`}></div>
          <div className="w-full h-full animate-[float_4s_ease-in-out_infinite] flex flex-col items-center justify-center">
            <div className="flex space-x-8 -mb-5 relative z-0">
                <div className={`w-5 h-20 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-full border-2 border-white/20 origin-bottom transform transition-all duration-700 ${isListening ? 'animate-[earTwitch_0.4s_infinite] bg-red-500 h-24' : 'rotate-[-12deg]'}`}></div>
                <div className={`w-5 h-20 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-full border-2 border-white/20 origin-bottom transform transition-all duration-700 ${isListening ? 'animate-[earTwitch_0.4s_infinite_reverse] bg-red-500 h-24' : 'rotate-[12deg]'}`}></div>
            </div>
            <div className={`relative w-24 h-24 bg-gradient-to-br from-zinc-900 via-slate-900 to-black rounded-[2.8rem] border-2 shadow-2xl flex flex-col items-center justify-center overflow-hidden z-10 transition-all duration-500 ${
              isListening ? 'border-red-500 shadow-red-500/50 scale-110' : isProcessing ? 'border-amber-500 shadow-amber-500/50 scale-105' : 'border-cyan-400 shadow-cyan-400/50'
            }`}>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className={`w-16 h-10 bg-zinc-950/80 rounded-2xl border flex items-center justify-center transition-all ${isListening ? 'border-red-500/40 bg-red-950/30' : isProcessing ? 'border-amber-500/40 bg-amber-950/30' : 'border-cyan-400/20'}`}>
                    {isListening ? <div className="flex space-x-2"><div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce"></div><div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce [animation-delay:200ms]"></div></div> :
                     isProcessing ? <div className="w-7 h-7 border-3 border-amber-500 border-t-transparent animate-spin rounded-full"></div> :
                     isReporting ? <div className="flex items-center space-x-1 h-5">{[...Array(7)].map((_, i) => (<div key={i} className="w-1 bg-cyan-400 animate-[barScale_0.5s_infinite]" style={{ animationDelay: `${i * 80}ms` }}></div>))}</div> :
                     <div className="flex space-x-6"><div className="w-4 h-1 bg-cyan-400 rounded-full shadow-[0_0_12px_cyan]"></div><div className="w-4 h-1 bg-cyan-400 rounded-full shadow-[0_0_12px_cyan]"></div></div>}
                </div>
            </div>
          </div>
        </button>
      </div>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes barScale { 0%, 100% { height: 6px; } 50% { height: 22px; } }
        @keyframes earTwitch { 0%, 100% { transform: rotate(-15deg) scaleY(1.1); } 50% { transform: rotate(15deg) scaleY(0.9); } }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;
