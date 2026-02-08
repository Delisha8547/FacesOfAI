
import React, { useState } from 'react';
import { AIPersona } from '../types';
import { Icons } from '../constants';

interface CreatorProps {
  onComplete: (persona: AIPersona) => void;
  onCancel: () => void;
}

const Creator: React.FC<CreatorProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<Partial<AIPersona>>({
    name: '',
    role: '',
    character: 'Professional',
    description: '',
    knowledgeBase: [],
    brainType: 'standard'
  });

  const finalize = () => {
    // Fixed: Removed 'avatarUrl' as it is not defined in the AIPersona interface
    const finalPersona: AIPersona = {
      ...persona as AIPersona,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      apiKey: `sk_faces_${Math.random().toString(36).substr(2, 16)}`,
      brainType: persona.brainType || 'standard',
    };
    onComplete(finalPersona);
  };

  const characters = [
    { name: 'Professional', desc: 'Concise, detached, and highly accurate.' },
    { name: 'Friendly', desc: 'Warm, encouraging, and helpful tone.' },
    { name: 'Academic', desc: 'Detailed, formal, and structured responses.' },
    { name: 'Witty', desc: 'Slightly sarcastic, sharp, and engaging.' },
    { name: 'Stoic', desc: 'Minimalist, direct, and serious.' }
  ];

  const steps = [
    { id: 1, title: 'Designation' },
    { id: 2, title: 'Character Core' },
    { id: 3, title: 'Neural Config' }
  ];

  return (
    <div className="p-8 h-full overflow-y-auto max-w-4xl mx-auto w-full pb-20">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2 font-heading">
            <span>Get Started !!</span>
            <span className="text-[10px] bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-tighter">Blank Slate</span>
          </h1>
          <p className="text-slate-400 text-sm">Develop and deploy your ideas</p>
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-300 font-medium">Cancel</button>
      </header>

      <div className="flex justify-between mb-12 relative max-w-2xl mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
        {steps.map(s => (
          <div key={s.id} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${step >= s.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
              {s.id}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${step === s.id ? 'text-indigo-400' : 'text-slate-600'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-10 shadow-2xl max-w-2xl mx-auto">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Title</label>
              <input 
                type="text" 
                placeholder="e.g., ARCHIVE-ALPHA"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-600/50 outline-none"
                value={persona.name}
                onChange={e => setPersona({...persona, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Functional Role</label>
              <input 
                type="text" 
                placeholder="e.g., Regional Law Expert"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-600/50 outline-none"
                value={persona.role}
                onChange={e => setPersona({...persona, role: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Neural Character Profile</label>
            <div className="grid grid-cols-1 gap-3">
              {characters.map(c => (
                <div 
                  key={c.name}
                  onClick={() => setPersona({...persona, character: c.name})}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${persona.character === c.name ? 'bg-indigo-600/10 border-indigo-600' : 'bg-slate-950 border-slate-800 hover:bg-slate-900'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-bold">{c.name}</span>
                    {persona.character === c.name && <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>}
                  </div>
                  <p className="text-xs text-slate-500">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Intelligence Tier</label>
            <div className="space-y-4">
               <div 
                  onClick={() => setPersona({...persona, brainType: 'standard'})}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${persona.brainType === 'standard' ? 'border-indigo-600 bg-indigo-600/10' : 'border-slate-800 bg-slate-950 hover:bg-slate-900'}`}
                >
                  <span className="text-white font-bold block mb-1">Fact Memory Module</span>
                  <p className="text-xs text-slate-500 font-medium">Optimized for quick learning and effortless recall of taught information.</p>
                </div>
                <div 
                  onClick={() => setPersona({...persona, brainType: 'high-performance'})}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${persona.brainType === 'high-performance' ? 'border-violet-600 bg-violet-600/10' : 'border-slate-800 bg-slate-950 hover:bg-slate-900'}`}
                >
                  <span className="text-white font-bold block mb-1">Reasoning Synapse Cluster</span>
                  <p className="text-xs text-slate-500 font-medium">Enables deeper understanding by linking ideas and uncovering complex relationships.</p>
                </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-12 pt-8 border-t border-slate-800/50">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`px-6 py-2 rounded-xl text-slate-400 hover:text-white transition-colors ${step === 1 ? 'invisible' : 'visible'}`}
          >
            Previous
          </button>
          
          {step < 3 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && (!persona.name || !persona.role)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={finalize}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-xl font-bold shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-105"
            >
              Develop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Creator;
