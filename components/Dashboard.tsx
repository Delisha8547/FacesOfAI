
import React from 'react';
import { AIPersona } from '../types';
import { Icons } from '../constants';

interface DashboardProps {
  personas: AIPersona[];
  onSelect: (persona: AIPersona) => void;
  onNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ personas, onSelect, onNew }) => {
  return (
    <div className="p-8 h-full overflow-y-auto pb-20">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Encoded Neural Matrixes</h1>
          <p className="text-slate-500 text-sm font-medium">You have authorized {personas.length} specialized vessels.</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 shadow-xl transition-all transform hover:scale-105"
        >
          <Icons.Plus />
          <span>New Vessel</span>
        </button>
      </header>

      {personas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-900/40 border border-slate-800/50 rounded-[3rem]">
          <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6 text-slate-700">
            <Icons.Bot />
          </div>
          <h3 className="text-xl font-bold text-slate-300">No Vessels Authorized</h3>
          <p className="text-slate-500 mt-2 text-center max-w-sm px-6 text-sm leading-relaxed">
            Authorized vessels start with zero knowledge. You must teach them every truth manually.
          </p>
          <button 
            onClick={onNew}
            className="mt-8 text-indigo-400 hover:text-indigo-300 font-bold tracking-[0.2em] uppercase text-[10px]"
          >
            Authorize First Vessel &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {personas.map((p) => (
            <div 
              key={p.id}
              onClick={() => onSelect(p)}
              className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all duration-300 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Icons.Bot />
              </div>

              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all font-mono font-bold">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors font-heading">{p.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.character} Character</p>
                </div>
              </div>

              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.1em] mb-6">{p.role}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.knowledgeBase.length} Taught Truths</span>
                </div>
                <div className="text-slate-600 group-hover:text-indigo-400 transition-colors">
                   <Icons.Send />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
