
import React, { useState } from 'react';
import { Task, Category } from '../types';
import { Calendar, CheckCircle, Circle, MoreHorizontal } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onToggleStatus: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, category, onToggleStatus }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div 
      onClick={() => setIsActive(!isActive)}
      className={`task-card-2026 relative group aspect-square rounded-[3rem] p-8 flex flex-col overflow-hidden border border-white/5
        ${isActive ? 'task-card-active' : 'glass-v2 hover:bg-white/[0.04] hover:border-white/10'}
      `}
    >
      {/* 2026 Ambient Depth */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-[3rem]">
        <div className={`absolute -top-[50%] -right-[20%] w-[100%] h-[100%] transition-opacity duration-1000 blur-[80px]
          ${isActive ? 'opacity-20' : 'opacity-0'}
        `} style={{ background: category?.color || '#8B5CF6' }} />
      </div>

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div 
          className="px-4 py-1.5 rounded-[1rem] text-[9px] font-black uppercase tracking-[0.2em] border"
          style={{ 
            backgroundColor: category ? `${category.color}10` : 'rgba(255,255,255,0.05)',
            borderColor: category ? `${category.color}30` : 'rgba(255,255,255,0.1)',
            color: category ? category.color : '#94a3b8'
          }}
        >
          {category ? category.name : 'Unassigned'}
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(task.id);
          }}
          className="relative group/check"
        >
          {task.status === 'Completed' ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-in zoom-in duration-300">
              <CheckCircle className="text-white" size={20} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-white/10 group-hover/check:border-white/40 group-hover/check:bg-white/5 transition-all flex items-center justify-center">
              <Circle className="text-white/0 group-hover/check:text-white/20 transition-all" size={20} />
            </div>
          )}
        </button>
      </div>

      <div className="relative z-10 flex-1">
        <h3 className={`text-2xl font-bold leading-[1.2] mb-4 tracking-tight transition-all duration-500 ${task.status === 'Completed' ? 'opacity-30 line-through' : 'text-white'}`}>
          {task.title}
        </h3>
        <p className={`text-sm leading-relaxed line-clamp-3 transition-opacity duration-500 ${task.status === 'Completed' ? 'opacity-20' : 'text-gray-500 group-hover:text-gray-400'}`}>
          {task.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        <button className="p-2 text-gray-600 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};
