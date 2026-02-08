
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Creator from './components/Creator';
import ChatSession from './components/ChatSession';
import { AIPersona, User } from './types';
import { Icons } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'creator' | 'chat' | 'about'>('dashboard');
  const [personas, setPersonas] = useState<AIPersona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ name: '', email: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [showWelcomeEmail, setShowWelcomeEmail] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('faces_of_ai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const saved = localStorage.getItem('faces_of_ai_personas');
    if (saved) {
      try {
        setPersonas(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load personas", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('faces_of_ai_personas', JSON.stringify(personas));
  }, [personas]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.name && loginForm.email) {
      setIsLoggingIn(true);
      setLoginStatus('Syncing Neural Data...');
      
      // Simulating a cleaner login process without the "sending email" status as requested
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newUser = { ...loginForm };
      setUser(newUser);
      localStorage.setItem('faces_of_ai_user', JSON.stringify(newUser));
      setIsLoggingIn(false);
      setLoginStatus(null);
      
      // Trigger the welcome "email" modal
      setShowWelcomeEmail(true);
    }
  };

  const handleCreateComplete = (newPersona: AIPersona) => {
    setPersonas(prev => [newPersona, ...prev]);
    setSelectedPersonaId(newPersona.id);
    setView('chat');
  };

  const handleSelectPersona = (p: AIPersona) => {
    setSelectedPersonaId(p.id);
    setView('chat');
  };

  const handleUpdateKnowledge = (personaId: string, newFact: string) => {
    setPersonas(prev => prev.map(p => {
      if (p.id === personaId) {
        return {
          ...p,
          knowledgeBase: [...p.knowledgeBase, newFact]
        };
      }
      return p;
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {isLoggingIn && (
            <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-white font-bold tracking-tight mb-2">FacesOfAI System</p>
              <p className="text-slate-400 text-sm animate-pulse">{loginStatus}</p>
            </div>
          )}
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </div>
            <h1 className="text-3xl font-bold text-white font-heading">FacesOfAI</h1>
            <p className="text-slate-500 mt-2 text-center">Neural Access Authorization</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Creator Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all"
                value={loginForm.name}
                onChange={e => setLoginForm({...loginForm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all"
                value={loginForm.email}
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
            >
              Enter Neural Network
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">Authorized Entry Only</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedPersona = personas.find(p => p.id === selectedPersonaId) || null;

  return (
    <Layout activeView={view} onNavigate={(v) => {
      setView(v);
      if (v !== 'chat') setSelectedPersonaId(null);
    }}>
      {/* Welcome "Email" Modal */}
      {showWelcomeEmail && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.2)] animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-800/80 px-8 py-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">FA</div>
                <div className="text-left">
                  <p className="text-white text-xs font-bold leading-none">FacesOfAI Transmissions</p>
                  <p className="text-slate-500 text-[10px] uppercase tracking-tighter">Automated Welcome System</p>
                </div>
              </div>
              <button onClick={() => setShowWelcomeEmail(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Subject: Welcome to the Neural Matrix, {user.name}!</p>
                <div className="h-px w-full bg-slate-800"></div>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4">
                <p>Greetings, <strong>{user.name}</strong>.</p>
                <p>
                  Welcome to the official <strong>FacesOfAI</strong> platform. You have been authorized to begin crafting specialized neural vessels. 
                </p>
                <p>
                  FacesOfAI is not just another chatbot—it's a blank canvas. Here, you define the character, the role, and the intelligence architecture. Most importantly, you are the teacher. Your AI knows nothing until you encode it.
                </p>
                <div className="bg-indigo-600/5 border border-indigo-500/10 p-4 rounded-xl italic text-xs text-indigo-400">
                  "Your intelligence is only as vast as the truths you are taught."
                </div>
                <p>
                  We are excited to see what unique entities you bring to life.
                </p>
              </div>
              <div className="pt-8 border-t border-slate-800/50 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Best regards,</p>
                  <p className="text-white font-bold font-heading">Delisha Blessy dinesh</p>
                  <p className="text-indigo-500 text-[10px] font-medium tracking-tighter uppercase">Founder & Architect</p>
                </div>
                <button 
                  onClick={() => setShowWelcomeEmail(false)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                >
                  Confirm Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <Dashboard 
          personas={personas} 
          onSelect={handleSelectPersona} 
          onNew={() => setView('creator')} 
        />
      )}
      {view === 'creator' && (
        <Creator 
          onComplete={handleCreateComplete} 
          onCancel={() => setView('dashboard')} 
        />
      )}
      {view === 'chat' && selectedPersona && (
        <ChatSession 
          persona={selectedPersona} 
          onBack={() => setView('dashboard')}
          onUpdateKnowledge={(fact) => handleUpdateKnowledge(selectedPersona.id, fact)}
        />
      )}
      {view === 'about' && (
        <div className="p-8 h-full flex items-center justify-center overflow-y-auto pb-20">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
              <Icons.Bot />
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white mb-6 font-heading tracking-tight">About FacesOfAI</h1>
              <div className="space-y-6 text-slate-400 leading-relaxed">
                <p>
                  <strong className="text-white">FacesOfAI</strong> is an innovative platform that empowers anyone — from individuals to startups — to create, train, and deploy their own personalized AI assistants.
                </p>
                <p>
                  Unlike traditional AI chatbots that are pre-trained and generic, FacesOfAI enables users to teach an AI a unique personality, style, or knowledge domain. We follow a <strong className="text-indigo-400 font-bold tracking-tighter uppercase text-xs border border-indigo-500/20 px-2 py-0.5 rounded ml-1 bg-indigo-600/5">Tabula Rasa</strong> philosophy: your AI begins as a blank slate, knowing absolutely nothing until you manually encode your truths into its neural matrix.
                </p>
                <div className="pt-8 mt-8 border-t border-slate-800">
                  <p className="text-xs uppercase tracking-[0.3em] font-bold text-slate-500 mb-2">Architect & Visionary</p>
                  <p className="text-2xl font-bold text-white font-heading">Delisha Blessy dinesh</p>
                </div>
              </div>
              <button 
                onClick={() => setView('dashboard')}
                className="mt-12 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
              >
                Return to Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
