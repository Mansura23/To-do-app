
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, color: string) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#8B5CF6');

  if (!isOpen) return null;

  const colors = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // emerald
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#6366F1', // indigo
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name, color);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass rounded-3xl shadow-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Add Category</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Category Name</label>
            <input 
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all"
              placeholder="e.g. Urgent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Color Scheme</label>
            <div className="flex flex-wrap gap-3">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ring-offset-2 ring-offset-black ${
                    color === c ? 'ring-2 ring-white scale-125' : 'opacity-60 hover:opacity-100 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-bold shadow-lg shadow-purple-900/40 transition-all mt-4"
          >
            Save Category
          </button>
        </form>
      </div>
    </div>
  );
};
