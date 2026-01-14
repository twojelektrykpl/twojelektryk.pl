
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Oczekujące</span>
          <span className="text-4xl font-black text-orange-500 mt-2">{pendingCount}</span>
        </div>
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">W realizacji</span>
          <span className="text-4xl font-black text-[#A3E635] mt-2">{progressCount}</span>
        </div>
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Data</span>
          <span className="text-2xl font-bold text-white mt-2">{new Date().toLocaleDateString('pl-PL')}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button 
          onClick={() => setFilter('ALL')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700'}`}
        >
          Wszystkie
        </button>
        {Object.values(TaskStatus).map(status => (
          <button 
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === status ? 'bg-[#A3E635] text-black shadow-lg shadow-lime-500/10' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700'}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onUpdateStatus={onUpdateStatus} />
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-zinc-950 rounded-3xl border border-zinc-900">
            <p className="text-zinc-600 font-medium">Brak aktywnych zleceń w tej sekcji.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
