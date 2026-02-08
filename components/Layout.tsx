
import React from 'react';
import { Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'dashboard' | 'creator' | 'chat' | 'about';
  onNavigate: (view: 'dashboard' | 'creator' | 'chat' | 'about') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Icons.Bot />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-heading">FacesOfAI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'dashboard' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Icons.Layers />
            <span className="font-medium">Library</span>
          </button>
          <button 
            onClick={() => onNavigate('creator')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'creator' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Icons.Plus />
            <span className="font-medium">Create AI</span>
          </button>
          <button 
            onClick={() => onNavigate('about')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'about' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Icons.Info />
            <span className="font-medium">About</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-xs text-slate-500 mb-2 uppercase font-bold tracking-wider">Plan</p>
            <p className="text-sm text-slate-200 font-medium">Free Developer Tier</p>
            <button className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all">
              Upgrade Pro
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="md:hidden absolute top-0 w-full h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-2">
           <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Icons.Bot />
            </div>
            <span className="text-lg font-bold text-white font-heading">FacesOfAI</span>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onNavigate('about')} className="p-2 text-slate-400">
            <Icons.Info />
          </button>
          <button onClick={() => onNavigate('creator')} className="p-2 bg-indigo-600 rounded-lg">
            <Icons.Plus />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
