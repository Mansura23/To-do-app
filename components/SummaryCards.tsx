
import React from 'react';
import { Task, TaskStatus } from '../types';
import { Layers, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';

interface SummaryCardsProps {
  tasks: Task[];
  activeFilter: TaskStatus | 'All';
  onFilterChange: (filter: TaskStatus | 'All') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ tasks, activeFilter, onFilterChange }) => {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  const stats = [
    { id: 'All' as const, label: 'Omni Scope', value: total, icon: Layers, color: 'text-blue-400', accent: 'bg-blue-500' },
    { id: 'Pending' as const, label: 'In Progress', value: pending, icon: Clock, color: 'text-purple-400', accent: 'bg-purple-500' },
    { id: 'Completed' as const, label: 'Finalized', value: completed, icon: CheckCircle, color: 'text-emerald-400', accent: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <button 
          key={stat.id}
          onClick={() => onFilterChange(stat.id)}
          className={`relative h-36 p-6 rounded-[2.5rem] transition-all duration-700 overflow-hidden border flex flex-col justify-between text-left
            ${activeFilter === stat.id 
              ? 'bg-white/[0.07] border-white/20 shadow-2xl shadow-black/40 scale-[1.02]' 
              : 'glass-v2 border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
            }
          `}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className={`flex items-center gap-3 ${stat.color}`}>
              <stat.icon size={22} className="opacity-80" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
            <ArrowUpRight size={16} className={`transition-transform duration-500 ${activeFilter === stat.id ? 'opacity-100 scale-125' : 'opacity-20'}`} />
          </div>
          
          <div className="flex items-end justify-between relative z-10">
            <span className="text-4xl font-black text-white tracking-tighter">{stat.value}</span>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 font-bold mb-2">Completion</span>
              <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div 
                  className={`h-full ${stat.accent} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]`} 
                  style={{ width: total > 0 ? `${(stat.value / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>
          
          {/* Subtle Ambient Glow */}
          {activeFilter === stat.id && (
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-[40px] opacity-20 ${stat.accent}`} />
          )}
        </button>
      ))}
    </div>
  );
};
