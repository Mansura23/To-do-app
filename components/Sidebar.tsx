
import React from 'react';
import { Layout, Inbox, BarChart2, Plus, Settings, LogOut, ChevronRight, Activity, User } from 'lucide-react';
import { Workspace, ViewType } from '../types';

interface SidebarProps {
  workspaces: Workspace[];
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onAddWorkspace: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ workspaces, activeView, setActiveView, onAddWorkspace, onOpenProfile, onLogout }) => {
  return (
    <aside className="hidden lg:flex w-80 flex-col py-8 px-4 relative z-50">
      {/* 2026 Brand Signature */}
      <div className="flex items-center gap-4 mb-14 px-4">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <Activity className="text-black" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tighter text-white">LUMINA</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">Neural Core</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Rail */}
      <div className="relative mb-12">
        {/* Continuous Vertical Track Line */}
        <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-white/5" />
        
        <div className="space-y-2">
          <h3 className="px-8 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Primary</h3>
          
          {/* User Profile Access */}
          <button
            onClick={onOpenProfile}
            className="w-full group relative flex items-center gap-6 px-8 py-4 rounded-2xl transition-all duration-500 text-gray-500 hover:text-white"
          >
            <div className="absolute left-[7.5px] w-[2px] h-0 bg-white group-hover:h-4 transition-all duration-500 rounded-full shadow-[0_0_10px_white]" />
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <User size={16} className="group-hover:text-white" />
              </div>
              <span className="font-bold text-sm tracking-tight">Identity</span>
            </div>
          </button>

          {/* Inbox Item */}
          <button
            onClick={() => setActiveView('Inbox')}
            className={`w-full group relative flex items-center justify-between px-8 py-4 rounded-2xl transition-all duration-500 ${
              activeView === 'Inbox' ? 'bg-white/[0.03] text-white shadow-xl' : 'text-gray-500 hover:text-white'
            }`}
          >
            {/* Active Indicator Segment on Track */}
            <div className={`absolute left-[7.5px] w-[2px] rounded-full transition-all duration-700 ${
              activeView === 'Inbox' ? 'h-6 bg-purple-500 shadow-[0_0_15px_#8B5CF6]' : 'h-0 bg-transparent'
            }`} />
            
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${activeView === 'Inbox' ? 'bg-purple-500/10' : 'bg-white/5'}`}>
                <Inbox size={16} className={activeView === 'Inbox' ? 'text-purple-400' : 'group-hover:text-purple-300'} />
              </div>
              <span className="font-bold text-sm tracking-tight">Inbox</span>
            </div>
            {activeView === 'Inbox' && <div className="w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_10px_#8B5CF6]" />}
          </button>

          {/* Analytics Item */}
          <button
            onClick={() => setActiveView('Analytics')}
            className={`w-full group relative flex items-center justify-between px-8 py-4 rounded-2xl transition-all duration-500 ${
              activeView === 'Analytics' ? 'bg-white/[0.03] text-white shadow-xl' : 'text-gray-500 hover:text-white'
            }`}
          >
            {/* Active Indicator Segment on Track */}
            <div className={`absolute left-[7.5px] w-[2px] rounded-full transition-all duration-700 ${
              activeView === 'Analytics' ? 'h-6 bg-pink-500 shadow-[0_0_15px_#D946EF]' : 'h-0 bg-transparent'
            }`} />

            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${activeView === 'Analytics' ? 'bg-pink-500/10' : 'bg-white/5'}`}>
                <BarChart2 size={16} className={activeView === 'Analytics' ? 'text-pink-400' : 'group-hover:text-pink-300'} />
              </div>
              <span className="font-bold text-sm tracking-tight">Analytics</span>
            </div>
            {activeView === 'Analytics' && <div className="w-1 h-1 rounded-full bg-pink-400 shadow-[0_0_10px_#D946EF]" />}
          </button>
        </div>
      </div>

      {/* Workspaces Section */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2">
        <div className="flex items-center justify-between px-6 mb-6">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Workspace</h3>
          <button 
            onClick={onAddWorkspace}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all text-gray-500 hover:text-white"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-1">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => setActiveView(ws.id)}
              className={`w-full group relative flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 ${
                activeView === ws.id ? 'bg-white/10 text-white border border-white/5 shadow-2xl shadow-black/40' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <span className="text-lg grayscale group-hover:grayscale-0 transition-all duration-500">{ws.icon}</span>
                <span className="font-bold text-sm tracking-tight truncate">{ws.name}</span>
              </div>
              {activeView === ws.id && <ChevronRight size={14} className="text-white/20" />}
            </button>
          ))}
        </div>
      </div>

      {/* Refined Footer */}
      <div className="mt-auto pt-8 px-2 border-t border-white/5">
        <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-600 hover:text-white hover:bg-white/5 transition-all font-bold text-sm">
          <Settings size={18} />
          <span>System Config</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Disconnect</span>
        </button>
      </div>
    </aside>
  );
};
