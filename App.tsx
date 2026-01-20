
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Task, TaskStatus } from './types';
import WorkerDashboard from './components/WorkerDashboard';
import ClientPortal from './components/ClientPortal';
import Statistics from './components/Statistics';
import Archive from './components/Archive';

const INITIAL_TASKS: Task[] = [
  {
    id: 'demo-1',
    title: 'Przykładowe zlecenie',
    description: 'To jest zlecenie demonstracyjne.',
    clientName: 'System',
    address: 'ul. Testowa 1, Warszawa',
    status: TaskStatus.PENDING,
    createdAt: new Date().toISOString(),
    priority: 'low'
  }
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('twojelektryk_db');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [role, setRole] = useState<'worker' | 'client'>(() => {
    const savedRole = localStorage.getItem('twojelektryk_role');
    return (savedRole as 'worker' | 'client') || 'worker';
  });

  useEffect(() => {
    try {
      localStorage.setItem('twojelektryk_db', JSON.stringify(tasks));
    } catch (e) {
      console.warn("Storage quota exceeded, could not save images.");
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('twojelektryk_role', role);
  }, [role]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      status: TaskStatus.PENDING
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus, time?: number, notes?: string, photo?: string, completedBy?: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        status, 
        completedAt: status === TaskStatus.COMPLETED ? new Date().toISOString() : t.completedAt,
        timeSpentMinutes: time || t.timeSpentMinutes,
        workerNotes: notes || t.workerNotes,
        photoAfter: photo || t.photoAfter,
        completedBy: completedBy || t.completedBy
      } : t
    ));
  };

  const activeTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED);
  const archivedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-black text-white selection:bg-[#A3E635] selection:text-black">
        <header className="pt-8 pb-4 bg-black sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* BRAND LOGO SECTION */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-2">
                <div className="absolute inset-0 bg-[#A3E635] blur-2xl opacity-20 rounded-full"></div>
                <svg width="50" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                  <path d="M20 2C13.3726 2 8 7.37258 8 14C8 18.3374 10.2974 22.1388 13.75 24.2812C14.7176 25.132 15.5 26.2415 15.5 27.5V31C15.5 32.1046 16.3954 33 17.5 33H22.5C23.6046 33 24.5 32.1046 24.5 31V27.5C24.5 26.2415 25.2824 25.132 26.25 24.2812C29.7026 22.1388 32 18.3374 32 14C32 7.37258 26.6274 2 20 2Z" stroke="#A3E635" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M16 12L20 8L24 12L20 16L16 12Z" fill="#A3E635" />
                  <path d="M20 16V22" stroke="#A3E635" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M17 38H23" stroke="#A3E635" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18 42H22" stroke="#A3E635" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black tracking-widest logo-font text-white uppercase leading-none">
                  TWOJELEKTRYK<span className="text-[#A3E635]">.PL</span>
                </span>
                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.5em] mt-1">System Zarządzania Serwisem</span>
              </div>
            </div>

            <div className="inline-flex p-1 bg-zinc-900 rounded-xl mb-4 border border-zinc-800 scale-90">
              <button onClick={() => setRole('worker')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${role === 'worker' ? 'bg-[#A3E635] text-black' : 'text-zinc-500'}`}>Technik</button>
              <button onClick={() => setRole('client')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${role === 'client' ? 'bg-[#A3E635] text-black' : 'text-zinc-500'}`}>Klient</button>
            </div>

            <nav className="flex justify-center space-x-1 border-t border-zinc-900 pt-3">
              {role === 'worker' ? (
                <>
                  <NavLink to="/" label="Zlecenia" />
                  <NavLink to="/archive" label="Archiwum" />
                  <NavLink to="/stats" label="Staty" />
                </>
              ) : (
                <>
                  <NavLink to="/client" label="Nowe Zgłoszenie" />
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <Routes>
            {role === 'worker' ? (
              <>
                <Route path="/" element={<WorkerDashboard tasks={activeTasks} onUpdateStatus={updateTaskStatus} />} />
                <Route path="/archive" element={<Archive tasks={archivedTasks} />} />
                <Route path="/stats" element={<Statistics tasks={tasks} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/client" element={<ClientPortal onAddTask={addTask} tasks={tasks} />} />
                <Route path="*" element={<Navigate to="/client" />} />
              </>
            )}
          </Routes>
        </main>

        <footer className="bg-black border-t border-zinc-900 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-zinc-800 text-[8px] tracking-[0.3em] uppercase">
            <p>&copy; 2024 TWOJELEKTRYK.PL • PROFESSIONAL FIELD SERVICE</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

const NavLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-[#A3E635]' : 'text-zinc-600 hover:text-zinc-300'}`}>
      {label}
    </Link>
  );
};

export default App;
