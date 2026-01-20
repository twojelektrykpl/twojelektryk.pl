
import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { summarizeTask } from '../geminiService';

interface Props {
  task: Task;
  onUpdateStatus: (id: string, status: TaskStatus, time?: number, notes?: string, photo?: string, completedBy?: string) => void;
}

const WORKERS = [
  "Piotr Rybicki",
  "Rafał Mańkut",
  "Tomasz Dubiela",
  "Grzegorz Chrust"
];

const TaskCard: React.FC<Props> = ({ task, onUpdateStatus }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [minutes, setMinutes] = useState(60);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState(WORKERS[0]);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await summarizeTask(task.description);
    setSummary(result);
    setIsSummarizing(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(task.id, TaskStatus.COMPLETED, minutes, notes, photo || undefined, selectedWorker);
    setShowCompletionForm(false);
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`bg-zinc-900 rounded-[2rem] p-6 md:p-8 border border-zinc-800 shadow-2xl transition-all hover:border-zinc-700 ${task.status === TaskStatus.COMPLETED ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex gap-2">
            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${task.priority === 'high' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              {task.priority}
            </span>
            <span className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest">#{task.id.slice(-4)}</span>
          </div>
          <h3 className="mt-3 text-lg font-black text-white uppercase tracking-tight">{task.title}</h3>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <button 
          onClick={openInMaps}
          className="flex items-center gap-3 w-full p-4 bg-black/40 rounded-2xl border border-zinc-800 hover:border-[#A3E635] transition-all group"
        >
          <div className="bg-zinc-800 p-2 rounded-lg group-hover:bg-[#A3E635]/20 group-hover:text-[#A3E635]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-zinc-600 uppercase">Lokalizacja (Kliknij by nawigować)</p>
            <p className="text-xs text-zinc-300 font-bold">{task.address}</p>
          </div>
        </button>
      </div>

      <div className="bg-black/20 p-4 rounded-2xl border border-zinc-800/50 mb-6">
        <p className="text-zinc-400 text-xs leading-relaxed italic">"{task.description}"</p>
      </div>

      {summary && (
        <div className="mb-6 p-4 bg-[#A3E635]/5 border border-[#A3E635]/10 rounded-2xl text-[11px] animate-fade-in text-zinc-300">
          <h4 className="font-black text-[#A3E635] uppercase tracking-widest mb-2">Instrukcja Serwisowa AI</h4>
          {summary}
        </div>
      )}

      <div className="flex gap-2">
        {task.status === TaskStatus.PENDING && (
          <button onClick={() => onUpdateStatus(task.id, TaskStatus.IN_PROGRESS)} className="flex-1 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">Podejmij pracę</button>
        )}
        {task.status === TaskStatus.IN_PROGRESS && (
          <button onClick={() => setShowCompletionForm(true)} className="flex-1 bg-[#A3E635] text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-lime-300 shadow-xl shadow-lime-500/20 transition-all">Finalizacja</button>
        )}
        {!summary && task.status !== TaskStatus.COMPLETED && (
          <button onClick={handleSummarize} disabled={isSummarizing} className="bg-zinc-800 text-white px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
            {isSummarizing ? '...' : 'AI'}
          </button>
        )}
      </div>

      {showCompletionForm && (
        <div className="mt-6 border-t border-zinc-800 pt-6 animate-fade-in space-y-6">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest">Osoba Wykonująca</label>
            <select 
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none text-sm appearance-none focus:border-[#A3E635] transition-all"
            >
              {WORKERS.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest">Zdjęcie z realizacji</label>
            <div className="relative group">
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" id={`photo-${task.id}`} />
              <label htmlFor={`photo-${task.id}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer hover:border-[#A3E635] transition-all bg-black/40">
                {photo ? (
                  <img src={photo} alt="Podgląd" className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-center">
                    <svg className="w-8 h-8 text-zinc-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-[10px] text-zinc-600 font-black uppercase">Zrób zdjęcie</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmitCompletion} className="space-y-4">
             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Czas pracy (minuty)</label>
                <input 
                  type="number" 
                  placeholder="Minuty"
                  value={minutes} 
                  onChange={(e) => setMinutes(parseInt(e.target.value))}
                  className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none text-sm focus:border-[#A3E635]"
                />
             </div>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Krótki raport techniczny..."
              className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none min-h-[80px] text-sm focus:border-[#A3E635]"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-[#A3E635] text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest font-black">Zakończ Zlecenie</button>
              <button type="button" onClick={() => setShowCompletionForm(false)} className="bg-zinc-800 text-zinc-500 px-6 rounded-2xl text-[10px] font-black uppercase">X</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
