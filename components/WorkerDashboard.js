
import React, { useState } from 'react';
import htm from 'htm';
import { TaskStatus } from '../types.js';
import TaskCard from './TaskCard.js';

const html = htm.bind(React.createElement);

const WorkerDashboard = ({ tasks, onUpdateStatus }) => {
  const [filter, setFilter] = useState('ALL');

  const filteredTasks = tasks.filter(t => filter === 'ALL' || t.status === filter);
  const pendingCount = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const progressCount = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;

  return html`
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Bieżące Zlecenia</h2>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-zinc-900 px-6 py-4 rounded-3xl border border-zinc-800">
            <span className="text-zinc-600 text-[9px] font-black uppercase block mb-1">Oczekujące</span>
            <span className="text-2xl font-black text-orange-500">${pendingCount}</span>
          </div>
          <div className="bg-zinc-900 px-6 py-4 rounded-3xl border border-zinc-800">
            <span className="text-zinc-600 text-[9px] font-black uppercase block mb-1">W pracy</span>
            <span className="text-2xl font-black text-[#A3E635]">${progressCount}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick=${() => setFilter('ALL')} className=${`px-4 py-2 rounded-xl text-[10px] font-black uppercase border ${filter === 'ALL' ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>Wszystkie</button>
        <button onClick=${() => setFilter(TaskStatus.PENDING)} className=${`px-4 py-2 rounded-xl text-[10px] font-black uppercase border ${filter === TaskStatus.PENDING ? 'bg-orange-500 text-black border-orange-500' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>Oczekujące</button>
        <button onClick=${() => setFilter(TaskStatus.IN_PROGRESS)} className=${`px-4 py-2 rounded-xl text-[10px] font-black uppercase border ${filter === TaskStatus.IN_PROGRESS ? 'bg-[#A3E635] text-black border-[#A3E635]' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>W pracy</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        ${filteredTasks.map(task => html`<${TaskCard} key=${task.id} task=${task} onUpdateStatus=${onUpdateStatus} />`)}
      </div>
    </div>
  `;
};

export default WorkerDashboard;
