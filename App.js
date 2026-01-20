
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import htm from 'htm';
import { TaskStatus } from './types.js';
import WorkerDashboard from './components/WorkerDashboard.js';
import ClientPortal from './components/ClientPortal.js';
import Statistics from './components/Statistics.js';
import Archive from './components/Archive.js';

const html = htm.bind(React.createElement);
html.Fragment = React.Fragment;

const DB_KEY = 'twojelektryk_db_v1';

const INITIAL_TASKS = [
  {
    id: 'demo-1',
    title: 'Zlecenie powitalne',
    description: 'System działa poprawnie. Twoja historia będzie tu zapisywana.',
    clientName: 'Administrator',
    address: 'Centrala Twojelektryk.pl',
    status: TaskStatus.PENDING,
    createdAt: new Date().toISOString(),
    priority: 'low'
  }
];

const App = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(DB_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Błąd odczytu bazy danych.", e);
    }
    return INITIAL_TASKS;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('twojelektryk_role') || 'worker';
  });

  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(tasks));
      setStorageError(false);
    } catch (e) {
      console.error("Błąd zapisu LocalStorage", e);
      setStorageError(true);
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('twojelektryk_role', role);
  }, [role]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      status: TaskStatus.PENDING
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id, status, time, notes, photo, completedBy) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        status, 
        completedAt: status === TaskStatus.COMPLETED ? new Date().toISOString() : t.completedAt,
        timeSpentMinutes: time !== undefined ? time : t.timeSpentMinutes,
        workerNotes: notes !== undefined ? notes : t.workerNotes,
        photoAfter: photo !== undefined ? photo : t.photoAfter,
        completedBy: completedBy !== undefined ? completedBy : t.completedBy
      } : t
    ));
  };

  const activeTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED);
  const archivedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED);

  return html`
    <${HashRouter}>
      <div className="min-h-screen flex flex-col bg-black text-white selection:bg-[#A3E635] selection:text-black">
        ${storageError && html`
          <div className="bg-red-600 text-white text-[10px] font-black p-2 text-center sticky top-0 z-[100] uppercase tracking-widest">
            Błąd pamięci! Usuń stare zdjęcia z archiwum.
          </div>
        `}
        
        <header className="pt-8 pb-4 bg-black sticky top-0 z-50 border-b border-zinc-900 backdrop-blur-md bg-black/80">
          <div className="max-w-7xl mx-auto px-4 text-center">
            
            <!-- BRAND LOGO WITH SVG ICON -->
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-2">
                <div className="absolute inset-0 bg-[#A3E635] blur-2xl opacity-20 rounded-full animate-pulse"></div>
                <svg width="50" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                  <path d="M20 2C13.3726 2 8 7.37258 8 14C8 18.3374 10.2974 22.1388 13.75 24.2812C14.7176 25.132 15.5 26.2415 15.5 27.5V31C15.5 32.1046 16.3954 33 17.5 33H22.5C23.6046 33 24.5 32.1046 24.5 31V27.5C24.5 26.2415 25.2824 25.132 26.25 24.2812C29.7026 22.1388 32 18.3374 32 14C32 7.37258 26.6274 2 20 2Z" stroke="#A3E635" stroke-width="3" stroke-linecap="round"/>
                  <path d="M16 12L20 8L24 12L20 16L16 12Z" fill="#A3E635" />
                  <path d="M20 16V22" stroke="#A3E635" stroke-width="2" stroke-linecap="round"/>
                  <path d="M17 38H23" stroke="#A3E635" stroke-width="2" stroke-linecap="round"/>
                  <path d="M18 42H22" stroke="#A3E635" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black tracking-widest logo-font text-white uppercase leading-none">
                  TWOJELEKTRYK<span className="text-[#A3E635]">.PL</span>
                </span>
                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.5em] mt-1">Professional Service System</span>
              </div>
            </div>
            
            <div className="inline-flex p-1 bg-zinc-900 rounded-xl mb-4 border border-zinc-800 scale-90">
              <button onClick=${() => setRole('worker')} className=${`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${role === 'worker' ? 'bg-[#A3E635] text-black' : 'text-zinc-500'}`}>Technik</button>
              <button onClick=${() => setRole('client')} className=${`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${role === 'client' ? 'bg-[#A3E635] text-black' : 'text-zinc-500'}`}>Klient</button>
            </div>

            <nav className="flex justify-center space-x-1 border-t border-zinc-900 pt-3">
              ${role === 'worker' ? html`
                <${html.Fragment}>
                  <${NavLink} to="/" label="Zlecenia" />
                  <${NavLink} to="/archive" label="Archiwum" />
                  <${NavLink} to="/stats" label="Statystyki" />
                <//>
              ` : html`
                <${NavLink} to="/client" label="Nowe Zgłoszenie" />
              `}
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto px-4 py-6 w-full">
          <${Routes}>
            ${role === 'worker' ? html`
              <${html.Fragment}>
                <${Route} path="/" element=${html`<${WorkerDashboard} tasks=${activeTasks} onUpdateStatus=${updateTaskStatus} />`} />
                <${Route} path="/archive" element=${html`<${Archive} tasks=${archivedTasks} />`} />
                <${Route} path="/stats" element=${html`<${Statistics} tasks=${tasks} />`} />
                <${Route} path="*" element=${html`<${Navigate} to="/" />`} />
              <//>
            ` : html`
              <${html.Fragment}>
                <${Route} path="/client" element=${html`<${ClientPortal} onAddTask=${addTask} tasks=${tasks} />`} />
                <${Route} path="*" element=${html`<${Navigate} to="/client" />`} />
              <//>
            `}
          <//>
        </main>
      </div>
    <//>
  `;
};

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return html`
    <${Link} to=${to} className=${`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-[#A3E635]' : 'text-zinc-600 hover:text-zinc-300'}`}>
      ${label}
    <//>
  `;
};

export default App;
