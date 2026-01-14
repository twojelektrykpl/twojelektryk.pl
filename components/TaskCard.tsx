
import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { summarizeTask } from '../geminiService';

interface Props {
  task: Task;
  onUpdateStatus: (id: string, status: TaskStatus, time?: number, notes?: string) => void;
}

const TaskCard: React.FC<Props> = ({ task, onUpdateStatus }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [minutes, setMinutes] = useState(60);
  const [notes, setNotes] = useState('');

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await summarizeTask(task.description);
    setSummary(result);
    setIsSummarizing(false);
  };

  const handleSubmitCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(task.id, TaskStatus.COMPLETED, minutes, notes);
    setShowCompletionForm(false);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    }
  };

  const getStatusColor = (s: TaskStatus) => {
    switch (s) {
      case TaskStatus.PENDING: return 'bg-orange-500/10 text-orange-500';
      case TaskStatus.IN_PROGRESS: return 'bg-lime-500/10 text-[#A3E635]';
      case TaskStatus.COMPLETED: return 'bg-zinc-800 text-zinc-500';
    }
  };

  return (
    <div className={`bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl transition-all hover:border-zinc-700 ${task.status === TaskStatus.COMPLETED ? 'opacity-60 grayscale' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
            {task.priority === 'high' ? 'PRIORYTET' : task.priority === 'medium' ? 'ŚREDNI' : 'NISKI'}
          </span>
          <h3 className="mt-4 text-xl font-black text-white leading-tight">{task.title}</h3>
        </div>
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <div className="bg-zinc-800 p-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <span className="font-bold">{task.clientName}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <div className="bg-zinc-800 p-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <span className="truncate">{task.address}</span>
        </div>
      </div>

      <div className="bg-black/50 p-5 rounded-2xl border border-zinc-800 mb-8">
        <p className="text-zinc-300 text-sm leading-relaxed">
          {task.description}
        </p>
      </div>

      {summary && (
        <div className="mb-8 p-5 bg-[#A3E635]/5 border border-[#A3E635]/20 rounded-2xl text-sm animate-fade-in">
          <h4 className="font-black text-[#A3E635] text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707zM6.464 14.95l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414z" /></svg>
            Analiza Systemu
          </h4>
          <div className="text-zinc-400 font-medium leading-relaxed">{summary}</div>
        </div>
      )}

      {task.status === TaskStatus.COMPLETED && (
        <div className="mb-6 p-4 bg-zinc-800/50 rounded-2xl text-xs text-zinc-500 border border-zinc-800 font-bold uppercase tracking-widest flex justify-between">
          <span>Wykonano: {task.timeSpentMinutes} min</span>
          {task.workerNotes && <span>Notatki: obecne</span>}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {task.status === TaskStatus.PENDING && (
          <button 
            onClick={() => onUpdateStatus(task.id, TaskStatus.IN_PROGRESS)}
            className="flex-1 bg-white text-black px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
          >
            Podejmij zlecenie
          </button>
        )}
        {task.status === TaskStatus.IN_PROGRESS && (
          <button 
            onClick={() => setShowCompletionForm(true)}
            className="flex-1 bg-[#A3E635] text-black px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-lime-300 shadow-xl shadow-lime-500/20 transition-all"
          >
            Zakończ prace
          </button>
        )}
        {!summary && task.status !== TaskStatus.COMPLETED && (
          <button 
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="bg-zinc-800 border border-zinc-700 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-700 transition-all disabled:opacity-50"
          >
            {isSummarizing ? 'Analizowanie...' : 'Analiza AI'}
          </button>
        )}
      </div>

      {showCompletionForm && (
        <div className="mt-8 border-t border-zinc-800 pt-8 animate-fade-in">
          <form onSubmit={handleSubmitCompletion} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Czas pracy (minuty)</label>
              <input 
                type="number" 
                required 
                value={minutes} 
                onChange={(e) => setMinutes(parseInt(e.target.value))}
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-[#A3E635] text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Opis działań</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Co dokładnie zostało zrobione?"
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-[#A3E635] text-white outline-none min-h-[100px]"
              />
            </div>
            <div className="flex gap-4">
              <button 
                type="submit" 
                className="flex-1 bg-[#A3E635] text-black px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest"
              >
                Potwierdź Wykonanie
              </button>
              <button 
                type="button" 
                onClick={() => setShowCompletionForm(false)}
                className="bg-zinc-800 text-zinc-400 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest"
              >
                Cofnij
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
