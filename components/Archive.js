
import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const Archive = ({ tasks }) => {
  return html`
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center px-4 mb-2">
         <h2 className="text-2xl font-black uppercase">Zakończone Prace</h2>
         <span className="text-xl font-black text-zinc-800 tracking-widest">${tasks.length}</span>
      </div>
      
      ${tasks.length === 0 ? html`
        <div className="bg-zinc-900/50 p-16 rounded-[2.5rem] border border-zinc-800 border-dashed text-center">
           <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">Brak zarchiwizowanych zadań</p>
        </div>
      ` : tasks.map(task => html`
        <div key=${task.id} className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 flex justify-between items-center gap-6 group hover:border-zinc-700 transition-all">
          <div className="flex-1">
            <h3 className="text-sm font-black uppercase text-white">${task.title}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
               <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">${task.clientName}</p>
               <span className="text-zinc-800 text-[9px]">|</span>
               <p className="text-[9px] text-[#A3E635] font-black uppercase tracking-widest">${task.completedBy}</p>
               <span className="text-zinc-800 text-[9px]">|</span>
               <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">${task.timeSpentMinutes} min</p>
            </div>
            ${task.workerNotes && html`<p className="text-[10px] text-zinc-600 mt-4 italic leading-relaxed border-l-2 border-zinc-800 pl-3">"${task.workerNotes}"</p>`}
          </div>
          ${task.photoAfter && html`
            <div className="relative flex-shrink-0">
               <img src=${task.photoAfter} className="w-20 h-20 rounded-2xl object-cover border border-zinc-800 shadow-xl grayscale hover:grayscale-0 transition-all duration-500" alt="Foto" />
            </div>
          `}
        </div>
      `)}
    </div>
  `;
};

export default Archive;
