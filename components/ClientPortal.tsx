
import React, { useState } from 'react';
import { Task } from '../types';

interface Props {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  tasks: Task[];
}

const ClientPortal: React.FC<Props> = ({ onAddTask, tasks }) => {
  const [clientName, setClientName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      title,
      description,
      address,
      priority,
      clientName: clientName || 'Klient'
    });
    setSubmitted(true);
    setTitle('');
    setDescription('');
    setAddress('');
    // We keep clientName filled for convenience of multiple reports
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-800">
        <div className="bg-gradient-to-br from-zinc-800 to-black p-10 border-b border-zinc-800">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Zgłoś Awarię</h2>
          <p className="text-zinc-500 text-sm mt-3 font-medium">System automatycznie przydzieli najbliższego dostępnego elektryka.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {submitted && (
            <div className="bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] p-5 rounded-3xl text-center font-black uppercase text-xs tracking-widest animate-pulse">
              Zgłoszenie Przyjęte. Technik został powiadomiony.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Nazwa Klienta / Imię i Nazwisko</label>
              <input 
                type="text" 
                required 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Np. Jan Kowalski"
                className="w-full p-5 bg-black border border-zinc-800 rounded-2xl focus:bg-zinc-900 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all text-white placeholder-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Temat Zgłoszenia</label>
              <input 
                type="text" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Krótki tytuł problemu"
                className="w-full p-5 bg-black border border-zinc-800 rounded-2xl focus:bg-zinc-900 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all text-white placeholder-zinc-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Adres Instalacji</label>
            <input 
              type="text" 
              required 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Gdzie mamy się pojawić?"
              className="w-full p-5 bg-black border border-zinc-800 rounded-2xl focus:bg-zinc-900 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all text-white placeholder-zinc-700"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Wymagany Czas Reakcji</label>
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full p-5 bg-black border border-zinc-800 rounded-2xl focus:bg-zinc-900 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all text-white appearance-none"
            >
              <option value="low">Standardowy (do 48h)</option>
              <option value="medium">Pilny (do 12h)</option>
              <option value="high">KRYTYCZNY (Natychmiast)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Szczegóły Usterki</label>
            <textarea 
              required 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Np. iskrzenie w gniazdku, brak oświetlenia w kuchni..."
              className="w-full p-5 bg-black border border-zinc-800 rounded-2xl focus:bg-zinc-900 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all text-white min-h-[150px] placeholder-zinc-700"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#A3E635] hover:bg-lime-300 text-black font-black py-6 rounded-[1.5rem] shadow-xl shadow-lime-500/10 transition-all uppercase tracking-widest flex justify-center items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Wyślij Do Serwisu
          </button>
        </form>
      </div>

      {tasks.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] px-4">Twoje Ostatnie Zgłoszenia</h3>
          <div className="space-y-4">
            {tasks.map(t => (
              <div key={t.id} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex justify-between items-center transition-all hover:bg-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-white uppercase text-sm tracking-wide">{t.title}</h4>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">[{t.clientName}]</span>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-bold mt-1 tracking-widest uppercase">{new Date(t.createdAt).toLocaleDateString()} o {new Date(t.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${t.status === 'Oczekujące' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : t.status === 'W trakcie' ? 'bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;
