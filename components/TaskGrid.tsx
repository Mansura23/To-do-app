
import React from 'react';
import { Task, Category } from '../types';
import { TaskCard } from './TaskCard';

interface TaskGridProps {
  tasks: Task[];
  categories: Category[];
  onToggleStatus: (id: string) => void;
}

export const TaskGrid: React.FC<TaskGridProps> = ({ tasks, categories, onToggleStatus }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-50">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <span className="text-4xl">📭</span>
        </div>
        <p className="text-xl font-medium">No tasks found</p>
        <p className="text-sm">Time to start something new!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          category={categories.find(c => c.id === task.categoryId)}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};
