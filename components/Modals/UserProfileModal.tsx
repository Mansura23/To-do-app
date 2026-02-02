
import React, { useMemo } from 'react';
import { X, Mail, MapPin, Award, Clock, ArrowRight } from 'lucide-react';
import { Task } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  user: { name: string; email: string };
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, tasks, user }) => {
  if (!isOpen) return null;

  const userDetails = {
    ...user,
    joinedDate: "2026.01.12",
    location: "Neo Tokyo // Orbit",
    role: "Core Systems Architect",
  };

  const activityData = useMemo(() => {
    const days = 140;
    const data = [];
    const now = new Date();
    const taskCounts: Record<string, number> = {};
    tasks.forEach(task => {
      const dateStr = new Date(task.createdAt).toDateString();
      taskCounts[dateStr] = (taskCounts[dateStr] || 0) + 1;
    });

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const count = taskCounts[dateStr] || (Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0);
      data.push({ date: dateStr, count });
    }
    return data;
  }, [tasks]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-white/[0.03]';
    if (count === 1) return 'bg-purple-900/40';
    if (count === 2) return 'bg-purple-700/60';
    if (count === 3) return 'bg-purple-500';
    return 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl glass-v2 rounded-[4rem] shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in-95 duration-700">
        {/* Profile Banner */}
        <div className="h-40 bg-gradient-to-br from-indigo-950 via-purple-900/20 to-black relative">
          <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-3 glass-v2 rounded-full text-white/70 hover:text-white transition-all z-10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-12 pb-12">
          {/* Avatar Area */}
          <div className="flex items-end gap-8 -mt-16 mb-10 relative z-10">
            <div className="w-36 h-36 rounded-[3rem] bg-white border-8 border-[#080710] shadow-2xl flex items-center justify-center text-4xl font-black text-black">
              {userDetails.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="pb-4">
              <h2 className="text-4xl font-black text-white tracking-tighter mb-1">{userDetails.name}</h2>
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-purple-500" /> {userDetails.location}</span>
                <span className="text-purple-400">Pro Operator</span>
              </div>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.06] transition-all">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Neural Identity</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white/90">{userDetails.email}</p>
                <Mail size={16} className="text-white/20 group-hover:text-purple-400 transition-colors" />
              </div>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.06] transition-all">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Activation Date</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white/90">{userDetails.joinedDate}</p>
                <Clock size={16} className="text-white/20 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          </div>

          {/* GitHub Style Contributions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <Activity size={16} className="text-emerald-400" />
                Performance Signal
              </h3>
              <div className="px-4 py-1.5 rounded-full bg-white/5 text-[9px] font-bold text-gray-400 uppercase">Archive // 20 Weeks</div>
            </div>

            <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5">
              <div className="flex flex-wrap gap-1.5 justify-center">
                {activityData.map((day, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-[3px] transition-all duration-500 cursor-crosshair hover:scale-150 hover:z-20 ${getIntensityClass(day.count)}`}
                    title={`${day.count} nodes processed on ${day.date}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-8 text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] px-2">
                <span>Dormant</span>
                <div className="flex gap-2 items-center">
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.03]" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-purple-900/40" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-purple-500" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-white shadow-sm" />
                </div>
                <span>Peak Efficiency</span>
              </div>
            </div>
          </div>

          <button className="w-full mt-10 py-5 rounded-[2rem] bg-white text-black font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
            Request Data Export <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Internal Activity Icon for use in the profile
const Activity = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
