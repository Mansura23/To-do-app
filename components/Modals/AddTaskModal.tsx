
import React, { useState } from 'react';
import { Workspace, Category, Task } from '../../types';
import { X } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  workspaces: Workspace[];
  categories: Category[];
  defaultWorkspaceId?: string;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd, workspaces, categories, defaultWorkspaceId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [wsId, setWsId] = useState(defaultWorkspaceId || workspaces[0]?.id || '');
  const [catId, setCatId] = useState(categories[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !wsId) return;
    onAdd({
      title,
      description,
      workspaceId: wsId,
      categoryId: catId,
      status: 'Pending'
    });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass rounded-3xl shadow-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">New Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
            <input 
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all"
              placeholder="Task name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all h-24 resize-none"
              placeholder="Detailed explanation..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Workspace</label>
              <select 
                value={wsId}
                onChange={e => setWsId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all appearance-none"
              >
                {workspaces.map(ws => <option key={ws.id} value={ws.id}>{ws.icon} {ws.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <select 
                value={catId}
                onChange={e => setCatId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all appearance-none"
              >
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-bold shadow-lg shadow-purple-900/40 transition-all mt-4"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};
