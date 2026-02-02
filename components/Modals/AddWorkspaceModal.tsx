
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, icon: string) => void;
}

export const AddWorkspaceModal: React.FC<AddWorkspaceModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💼');

  if (!isOpen) return null;

  const icons = ['🚀', '💼', '🎯', '🎨', '💻', '💡', '🌟', '📁'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name, icon);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass rounded-3xl shadow-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Add Workspace</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Workspace Name</label>
            <input 
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all"
              placeholder="e.g. Q4 Strategy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Choose an Icon</label>
            <div className="flex flex-wrap gap-2">
              {icons.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                    icon === i ? 'bg-purple-600 border border-purple-400 scale-110' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-bold shadow-lg shadow-purple-900/40 transition-all mt-4"
          >
            Create Workspace
          </button>
        </form>
      </div>
    </div>
  );
};
