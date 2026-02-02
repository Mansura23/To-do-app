
import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SummaryCards } from './components/SummaryCards';
import { TaskGrid } from './components/TaskGrid';
import { AnalyticsView } from './components/AnalyticsView';
import { AddTaskModal } from './components/Modals/AddTaskModal';
import { AddWorkspaceModal } from './components/Modals/AddWorkspaceModal';
import { AddCategoryModal } from './components/Modals/AddCategoryModal';
import { UserProfileModal } from './components/Modals/UserProfileModal';
import { LoginPage } from './components/Auth/LoginPage';
import { Task, Workspace, Category, ViewType, TaskStatus } from './types';
import { Plus, FolderPlus, Command, AlertTriangle, X } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  updateDoc, 
  doc, 
  onSnapshot,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';

const DEFAULT_WORKSPACES: Workspace[] = [
  { id: 'ws-1', name: 'Core Engine', icon: '⚡' },
  { id: 'ws-2', name: 'Experience Design', icon: '🎨' },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Engineering', color: '#8B5CF6' },
  { id: 'cat-2', name: 'UI/UX', color: '#EC4899' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [appError, setAppError] = useState<string | null>(null);

  // Workspaces and Categories are now LOCAL (kept only tasks in firebase)
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem('lumina_workspaces');
    return saved ? JSON.parse(saved) : DEFAULT_WORKSPACES;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('lumina_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeView, setActiveView] = useState<ViewType>('Inbox');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddWorkspaceModalOpen, setIsAddWorkspaceModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

  // Persistence for local items
  useEffect(() => {
    localStorage.setItem('lumina_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('lumina_categories', JSON.stringify(categories));
  }, [categories]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setUserId(user.uid);
        setCurrentUser({ 
          name: user.displayName || user.email?.split('@')[0] || 'Operator', 
          email: user.email || '' 
        });
        setIsAuthenticated(true);
      } else {
        setUserId(null);
        setIsAuthenticated(false);
      }
      setIsInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Task Sync
  useEffect(() => {
    if (!userId) return;

    const qTasks = query(
      collection(db, 'tasks'), 
      where('userId', '==', userId), 
      orderBy('createdAt', 'desc')
    );

    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now() 
      } as Task));
      setTasks(taskData);
    }, (err) => {
      console.error("Tasks sync error:", err);
      if (err.code === 'permission-denied') {
        setAppError("Cloud connection limited. Check Firestore rules.");
      } else if (err.message.includes('index')) {
        setAppError("System optimizing. Please wait a moment for data indexing...");
      }
    });

    return () => unsubTasks();
  }, [userId]);

  const viewTasks = useMemo(() => {
    if (activeView === 'Inbox' || activeView === 'Analytics') return tasks;
    return tasks.filter(t => t.workspaceId === activeView);
  }, [tasks, activeView]);

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'All') return viewTasks;
    return viewTasks.filter(t => t.status === statusFilter);
  }, [viewTasks, statusFilter]);

  const activeViewTitle = useMemo(() => {
    if (activeView === 'Inbox') return 'Inbox';
    if (activeView === 'Analytics') return 'Analytics';
    return workspaces.find(w => w.id === activeView)?.name || 'Project';
  }, [workspaces, activeView]);

  const handleToggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        status: task.status === 'Pending' ? 'Completed' : 'Pending'
      });
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId,
        createdAt: serverTimestamp(),
      });
      setIsAddTaskModalOpen(false);
    } catch (err: any) {
      console.error("Error adding task:", err);
      setAppError("Failed to save task to cloud.");
    }
  };

  // Local Actions (Since we only keep tasks in Firebase)
  const handleAddWorkspace = (name: string, icon: string) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      icon
    };
    setWorkspaces(prev => [...prev, newWs]);
    setIsAddWorkspaceModalOpen(false);
  };

  const handleAddCategory = (name: string, color: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      color
    };
    setCategories(prev => [...prev, newCat]);
    setIsAddCategoryModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen w-full p-4 lg:p-6 gap-6 relative">
      {appError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] w-full max-w-lg animate-in slide-in-from-top-4 duration-500 px-4">
          <div className="glass-v2 border-red-500/50 bg-red-500/10 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={20} />
              <p className="text-sm font-bold">{appError}</p>
            </div>
            <button onClick={() => setAppError(null)} className="p-1 hover:bg-white/5 rounded-full transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <Sidebar 
        workspaces={workspaces} 
        activeView={activeView} 
        setActiveView={(view) => {
          setActiveView(view);
          setStatusFilter('All');
        }} 
        onAddWorkspace={() => setIsAddWorkspaceModalOpen(true)}
        onOpenProfile={() => setIsUserProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto no-scrollbar rounded-[3rem] glass-v2 border-white/5 relative shadow-inner">
        <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-purple-400/80 font-bold tracking-[0.2em] text-[10px] uppercase">
                <Command size={14} className="animate-pulse" />
                <span>Operating System v2.6</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white">
                {activeViewTitle}
                {statusFilter !== 'All' && <span className="text-white/20 font-light ml-4">/ {statusFilter}</span>}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="group flex items-center gap-2 px-6 py-4 rounded-2xl glass-v2 hover:bg-white/5 transition-all text-sm font-bold border-white/10"
              >
                <FolderPlus size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                Category
              </button>
              {activeView !== 'Analytics' && (
                <button 
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all text-sm font-black uppercase tracking-widest"
                >
                  <Plus size={20} />
                  New Task
                </button>
              )}
            </div>
          </div>

          <SummaryCards 
            tasks={viewTasks} 
            activeFilter={statusFilter} 
            onFilterChange={setStatusFilter} 
          />

          <div className="relative pt-4">
            {activeView === 'Analytics' ? (
              <AnalyticsView tasks={tasks} workspaces={workspaces} />
            ) : (
              <TaskGrid 
                tasks={filteredTasks} 
                categories={categories} 
                onToggleStatus={handleToggleTaskStatus}
              />
            )}
          </div>
        </div>
      </main>

      <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={() => setIsAddTaskModalOpen(false)} 
        onAdd={handleAddTask} 
        workspaces={workspaces}
        categories={categories}
        defaultWorkspaceId={activeView.startsWith('ws-') ? activeView : (workspaces[0]?.id || '')}
      />
      <AddWorkspaceModal 
        isOpen={isAddWorkspaceModalOpen} 
        onClose={() => setIsAddWorkspaceModalOpen(false)} 
        onAdd={handleAddWorkspace}
      />
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAdd={handleAddCategory}
      />
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
        tasks={tasks}
        user={currentUser}
      />
    </div>
  );
};

export default App;
