
import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  onUpdateStatus: (id: string, status: TaskStatus, time?: number, notes?: string) => void;
}

const WorkerDashboard: React.FC<Props> = ({ tasks, onUpdateStatus }) => {
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');

  const filteredTasks = tasks.filter(t => filter === 'ALL' || t.status === filter);

  const pendingCount = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const progressCount = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Bieżące Zlecenia</h2>
          <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold">Aktywne operacje terenowe</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-zinc-900 px-6 py-4 rounded-3xl border border-zinc-800 flex-1 md:flex-none">
            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block mb-1">Do podjęcia</span>
            <span className="text-2xl font-black text-orange-500">{pendingCount}</span>
          </div>
          <div className="bg-zinc-900 px-6 py-4 rounded-3xl border border-zinc-800 flex-1 md:flex-none">
            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block mb-1">W pracy</span>
            <span className="text-2xl font-black text-[#A3E635]">{progressCount}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button 
          onClick={() => setFilter('ALL')}
          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === 'ALL' ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
        >
          Wszystkie Aktywne
        </button>
        <button 
          onClick={() => setFilter(TaskStatus.PENDING)}
          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === TaskStatus.PENDING ? 'bg-orange-500 text-black border-orange-500' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
        >
          Oczekujące
        </button>
        <button 
          onClick={() => setFilter(TaskStatus.IN_PROGRESS)}
          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === TaskStatus.IN_PROGRESS ? 'bg-[#A3E635] text-black border-[#A3E635]' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
        >
          W realizacji
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onUpdateStatus={onUpdateStatus} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-zinc-950 rounded-[3rem] border border-zinc-900">
            <svg className="w-12 h-12 text-zinc-800 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Brak aktywnych zleceń</p>
            <p className="text-zinc-800 text-[10px] mt-2 font-medium">Wszystkie prace zostały ukończone i zarchiwizowane.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
