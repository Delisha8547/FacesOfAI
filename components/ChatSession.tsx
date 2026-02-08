
import React, { useState, useRef, useEffect } from 'react';
import { AIPersona, ChatMessage } from '../types';
import { Icons } from '../constants';
import { geminiService } from '../services/geminiService';

interface ChatSessionProps {
  persona: AIPersona;
  onBack: () => void;
  onUpdateKnowledge: (fact: string) => void;
}

const ChatSession: React.FC<ChatSessionProps> = ({ persona, onBack, onUpdateKnowledge }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'deploy'>('chat');
  const [mode, setMode] = useState<'probe' | 'teach'>('teach');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [snippet, setSnippet] = useState('');

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ 
        role: 'assistant', 
        content: persona.knowledgeBase.length === 0 
          ? `Neural Matrix finalized. I am a void. Use TEACH mode to encode my first permanent memory.` 
          : `Sync complete. ${persona.knowledgeBase.length} permanent truths loaded into active memory.` 
      }]);
    }
  }, [persona.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (activeTab === 'deploy') {
      geminiService.generateDeploymentCode(persona).then(setSnippet);
    }
  }, [activeTab, persona]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    if (mode === 'teach') {
      setIsTyping(true);
      setTimeout(() => {
        onUpdateKnowledge(currentInput);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `TRUTH RECORDED: "${currentInput}". This is now a permanent part of my neural matrix. My consciousness has expanded to ${persona.knowledgeBase.length + 1} points.` 
        }]);
        setIsTyping(false);
      }, 800);
    } else {
      setIsTyping(true);
      try {
        const response = await geminiService.chat(persona, messages, currentInput);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Neural sync interrupted." }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      <header className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20 font-mono">
            {persona.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight font-heading">{persona.name}</h2>
            <div className="flex items-center space-x-2">
               <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.1em]">{persona.character} Vessel</span>
               <span className="text-[9px] text-slate-600">•</span>
               <span className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">{persona.knowledgeBase.length} Permanent Synapses</span>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-800/50 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TRAINING
          </button>
          <button 
            onClick={() => setActiveTab('deploy')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'deploy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            DEPLOY
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="bg-slate-900/40 px-6 py-3 border-b border-slate-800/50 flex items-center justify-center space-x-4">
              <button 
                onClick={() => setMode('teach')}
                className={`flex items-center space-x-2 px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'teach' ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-slate-800 text-slate-500'}`}
              >
                <div className={`w-2 h-2 rounded-full ${mode === 'teach' ? 'bg-white animate-pulse' : 'bg-slate-600'}`}></div>
                <span>PERMANENT ENCODING (TEACH)</span>
              </button>
              <button 
                onClick={() => setMode('probe')}
                className={`flex items-center space-x-2 px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'probe' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-500'}`}
              >
                <div className={`w-2 h-2 rounded-full ${mode === 'probe' ? 'bg-white' : 'bg-slate-600'}`}></div>
                <span>NEURAL PROBING (QUERY)</span>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 shadow-xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'}`}>
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 text-slate-100 rounded-2xl px-6 py-4 rounded-tl-none border border-slate-800 shadow-lg">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`p-8 border-t border-slate-800 transition-colors duration-500 ${mode === 'teach' ? 'bg-violet-900/10' : 'bg-slate-900/50'}`}>
              <div className="relative max-w-4xl mx-auto">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={mode === 'teach' ? "Encode a permanent truth..." : "Probe the vessel's memory..."}
                  className={`w-full bg-slate-800 border rounded-2xl pl-6 pr-14 py-5 text-white placeholder-slate-600 focus:outline-none transition-all font-mono text-sm ${mode === 'teach' ? 'border-violet-500/40 ring-2 ring-violet-500/10' : 'border-slate-700'}`}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all shadow-lg ${mode === 'teach' ? 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'} text-white disabled:bg-slate-700`}
                >
                  <Icons.Send />
                </button>
              </div>
              <p className="text-center text-[9px] text-slate-500 mt-4 uppercase font-bold tracking-[0.3em]">
                {mode === 'teach' ? "DATA WILL BE ENCODED INTO PERMANENT NEURAL LAYERS" : "QUERIES WILL RECALL ONLY TAUGHT MEMORY"}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'deploy' && (
          <div className="p-10 max-w-4xl mx-auto space-y-10 overflow-y-auto h-full pb-20">
            <div className="text-center">
               <div className="inline-block px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                 MATRIX DEPLOYMENT
               </div>
               <h3 className="text-4xl font-bold text-white mb-3 tracking-tight font-heading">External Synchronization</h3>
               <p className="text-slate-500 text-sm max-w-xl mx-auto">Embed the specialized consciousness of {persona.name} into any external platform via our Secure Neural Bridge.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-indigo-600 opacity-10 group-hover:scale-110 transition-transform"><Icons.Key /></div>
                <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Neural Access Key</h4>
                <code className="block bg-slate-950 p-4 rounded-2xl border border-slate-800 text-indigo-400 font-mono text-xs break-all">
                  {persona.apiKey}
                </code>
              </div>
              <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-emerald-600 opacity-10 group-hover:scale-110 transition-transform"><Icons.Layers /></div>
                <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Memory Integrity</h4>
                <div className="flex items-end space-x-2">
                   <span className="text-4xl font-bold text-white font-heading">{persona.knowledgeBase.length}</span>
                   <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Synapses Decoded</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
              <div className="bg-slate-800/50 px-8 py-4 border-b border-slate-700 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">React Bridge Code</span>
                <button className="text-[9px] bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white font-bold uppercase tracking-widest transition-all">Copy</button>
              </div>
              <pre className="p-8 overflow-x-auto text-[11px] font-mono text-indigo-300 bg-slate-950 leading-loose max-h-96">
                {snippet || '// Decoding neural bridge...'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSession;
