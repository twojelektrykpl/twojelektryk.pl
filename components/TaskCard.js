
import React, { useState } from 'react';
import htm from 'htm';
import { TaskStatus } from '../types.js';
import { summarizeTask } from '../geminiService.js';

const html = htm.bind(React.createElement);
html.Fragment = React.Fragment;

const WORKERS = ["Piotr Rybicki", "Rafał Mańkut", "Tomasz Dubiela", "Grzegorz Chrust"];

const TaskCard = ({ task, onUpdateStatus }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [minutes, setMinutes] = useState(60);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(WORKERS[0]);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await summarizeTask(task.description);
    setSummary(result);
    setIsSummarizing(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Ograniczamy wielkość zdjęcia przed zapisem, aby nie zapchać localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          setPhoto(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCompletion = (e) => {
    e.preventDefault();
    onUpdateStatus(task.id, TaskStatus.COMPLETED, minutes, notes, photo || undefined, selectedWorker);
    setShowCompletionForm(false);
  };

  return html`
    <div className="bg-zinc-900 rounded-[2rem] p-6 border border-zinc-800 shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded text-[8px] font-black uppercase">#${task.id.slice(-4)}</span>
          <h3 className="text-lg font-black uppercase text-white mt-1">${task.title}</h3>
          <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1">${task.address}</p>
        </div>
      </div>
      
      <div className="bg-black/40 p-4 rounded-xl mb-4 italic text-xs text-zinc-400">
        "${task.description}"
      </div>

      ${summary && html`
        <div className="mb-4 p-4 bg-[#A3E635]/5 border border-[#A3E635]/20 rounded-xl text-[11px] text-zinc-300 animate-fade-in">
          <p className="font-black text-[#A3E635] uppercase mb-1">AI Raport:</p>
          ${summary}
        </div>
      `}

      <div className="flex gap-2">
        ${task.status === TaskStatus.PENDING && html`
          <button onClick=${() => onUpdateStatus(task.id, TaskStatus.IN_PROGRESS)} className="flex-1 bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">Podejmij</button>
        `}
        ${task.status === TaskStatus.IN_PROGRESS && html`
          <button onClick=${() => setShowCompletionForm(true)} className="flex-1 bg-[#A3E635] text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-lime-500/10">Gotowe</button>
        `}
        ${!summary && task.status !== TaskStatus.COMPLETED && html`
          <button onClick=${handleSummarize} disabled=${isSummarizing} className="bg-zinc-800 px-6 py-4 rounded-xl text-[10px] font-black uppercase text-white">
            ${isSummarizing ? '...' : 'AI'}
          </button>
        `}
      </div>

      ${showCompletionForm && html`
        <form onSubmit=${handleSubmitCompletion} className="mt-6 space-y-4 border-t border-zinc-800 pt-6 animate-fade-in">
          <select value=${selectedWorker} onChange=${(e) => setSelectedWorker(e.target.value)} className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-[#A3E635]">
            ${WORKERS.map(w => html`<option key=${w} value=${w}>${w}</option>`)}
          </select>
          
          <div className="relative group">
             <input type="file" accept="image/*" capture="environment" onChange=${handlePhotoChange} id=${`photo-${task.id}`} className="hidden" />
             <label htmlFor=${`photo-${task.id}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-[#A3E635] transition-all bg-black/40 overflow-hidden">
               ${photo ? html`<img src=${photo} className="h-full w-full object-cover" />` : html`<div className="text-[10px] font-black uppercase text-zinc-600">Dodaj zdjęcie (kompresja)</div>`}
             </label>
          </div>

          <input type="number" value=${minutes} onChange=${(e) => setMinutes(parseInt(e.target.value))} className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-[#A3E635]" placeholder="Minuty pracy" />
          
          <textarea value=${notes} onChange=${(e) => setNotes(e.target.value)} placeholder="Opis wykonanych prac..." className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white text-xs min-h-[80px] outline-none focus:border-[#A3E635]" />
          
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-[#A3E635] text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">Wyślij Raport</button>
            <button type="button" onClick=${() => setShowCompletionForm(false)} className="bg-zinc-800 text-zinc-500 px-6 rounded-xl text-[10px] font-black uppercase">X</button>
          </div>
        </form>
      `}
    </div>
  `;
};

export default TaskCard;
