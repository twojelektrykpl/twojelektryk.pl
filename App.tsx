
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Task, TaskStatus } from './types';
import WorkerDashboard from './components/WorkerDashboard';
import ClientPortal from './components/ClientPortal';
import Statistics from './components/Statistics';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Naprawa rozdzielni',
    description: 'Brak zasilania w części kuchennej, wybija bezpiecznik główny.',
    clientName: 'Restauracja Smak',
    address: 'ul. Nowy Świat 45, Warszawa',
    status: TaskStatus.PENDING,
    createdAt: new Date().toISOString(),
    priority: 'high'
  },
  {
    id: '2',
    title: 'Montaż oświetlenia LED',
    description: 'Instalacja taśm LED w suficie podwieszanym w salonie.',
    clientName: 'Anna Nowak',
    address: 'ul. Wilcza 10, Warszawa',
    status: TaskStatus.IN_PROGRESS,
    createdAt: new Date().toISOString(),
    priority: 'medium'
  }
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('workflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [role, setRole] = useState<'worker' | 'client'>(() => {
    const savedRole = localStorage.getItem('workflow_role');
    return (savedRole as 'worker' | 'client') || 'worker';
  });

  useEffect(() => {
    localStorage.setItem('workflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('workflow_role', role);
  }, [role]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: TaskStatus.PENDING
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus, time?: number, notes?: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        status, 
        completedAt: status === TaskStatus.COMPLETED ? new Date().toISOString() : t.completedAt,
        timeSpentMinutes: time || t.timeSpentMinutes,
        workerNotes: notes || t.workerNotes
      } : t
    ));
  };

  // Filter tasks for client view: showing anything created in the current session/localStorage that wasn't part of initial demo
  // Or simply show all tasks for this demo purpose, but we'll try to keep it cleaner.
  const clientTasks = tasks.filter(t => !['1', '2'].includes(t.id));

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-black text-white">
        {/* Header with New Logo Design */}
        <header className="pt-12 pb-6 bg-black">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Logo from Image Implementation */}
            <div className="flex flex-col items-center mb-8">
              <div className="mb-4">
                <svg width="80" height="100" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2C13.3726 2 8 7.37258 8 14C8 18.3374 10.2974 22.1388 13.75 24.2812C14.7176 25.132 15.5 26.2415 15.5 27.5V31C15.5 32.1046 16.3954 33 17.5 33H22.5C23.6046 33 24.5 32.1046 24.5 31V27.5C24.5 26.2415 25.2824 25.132 26.25 24.2812C29.7026 22.1388 32 18.3374 32 14C32 7.37258 26.6274 2 20 2Z" stroke="#A3E635" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M17 37H23" stroke="#A3E635" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M18 41H22" stroke="#A3E635" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M17.5 13.5C17.5 13.5 18 17.5 20 17.5C22 17.5 22.5 13.5 22.5 13.5" stroke="#A3E635" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M20 17.5V21" stroke="#A3E635" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-widest logo-font text-white uppercase">
                TWOJELEKTRYK.PL
              </h1>
            </div>

            {/* Role Switcher */}
            <div className="inline-flex p-1 bg-zinc-900 rounded-2xl mb-8 border border-zinc-800">
              <button 
                onClick={() => setRole('worker')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${role === 'worker' ? 'bg-[#A3E635] text-black shadow-lg shadow-lime-500/20' : 'text-zinc-500 hover:text-white'}`}
              >
                Panel Pracownika
              </button>
              <button 
                onClick={() => setRole('client')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${role === 'client' ? 'bg-[#A3E635] text-black shadow-lg shadow-lime-500/20' : 'text-zinc-500 hover:text-white'}`}
              >
                Panel Klienta
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex justify-center space-x-2 border-t border-zinc-900 pt-6">
              {role === 'worker' ? (
                <>
                  <NavLink to="/" label="Lista Zleceń" />
                  <NavLink to="/stats" label="Statystyki" />
                </>
              ) : (
                <>
                  <NavLink to="/client" label="Zgłoś Awarię" />
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <Routes>
            {role === 'worker' ? (
              <>
                <Route path="/" element={<WorkerDashboard tasks={tasks} onUpdateStatus={updateTaskStatus} />} />
                <Route path="/stats" element={<Statistics tasks={tasks} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/client" element={<ClientPortal onAddTask={addTask} tasks={clientTasks} />} />
                <Route path="*" element={<Navigate to="/client" />} />
              </>
            )}
          </Routes>
        </main>

        <footer className="bg-black border-t border-zinc-900 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-zinc-600 text-xs tracking-widest uppercase">
            <p>&copy; 2024 Twójelektryk.pl - Profesjonalne Usługi Elektryczne</p>
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
    <Link 
      to={to} 
      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all uppercase tracking-wider ${
        isActive 
          ? 'text-[#A3E635]' 
          : 'text-zinc-500 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
};

export default App;
