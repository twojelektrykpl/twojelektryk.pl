
import React from 'react';
import { Task } from '../types';

interface Props {
  tasks: Task[];
}

const Archive: React.FC<Props> = ({ tasks }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Zrealizowane</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Historia operacji</p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-[#A3E635]">{tasks.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-[2rem] group transition-all">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-black text-white uppercase">{task.title}</h3>
                  <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">ID: {task.id.slice(-4)}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                  <div><span className="text-zinc-700 block mb-1">Klient</span> {task.clientName}</div>
                  <div><span className="text-zinc-700 block mb-1">Adres</span> {task.address.split(',')[0]}</div>
                  <div><span className="text-zinc-700 block mb-1">Czas</span> {task.timeSpentMinutes} min</div>
                  <div><span className="text-zinc-700 block mb-1">Data</span> {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : '-'}</div>
                </div>
                {task.completedBy && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Wykonawca:</span>
                    <span className="text-[10px] font-black text-[#A3E635] uppercase">{task.completedBy}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {task.photoAfter && (
                  <div className="w-20 h-20 bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 shadow-lg">
                    <img src={task.photoAfter} alt="Realizacja" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archive;
