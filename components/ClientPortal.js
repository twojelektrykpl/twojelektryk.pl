
import React, { useState } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const ClientPortal = ({ onAddTask, tasks }) => {
  const [clientName, setClientName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({ title, description, address, priority, clientName });
    setTitle(''); setDescription(''); setAddress('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return html`
    <div className="max-w-xl mx-auto space-y-8">
      <form onSubmit=${handleSubmit} className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 space-y-6 animate-fade-in shadow-2xl">
        <h2 className="text-2xl font-black uppercase">Nowe Zgłoszenie</h2>
        ${submitted && html`<div className="bg-[#A3E635]/10 text-[#A3E635] p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">Zgłoszenie wysłane!</div>`}
        <input placeholder="Imię i Nazwisko" required value=${clientName} onChange=${e => setClientName(e.target.value)} className="w-full p-5 bg-black border border-zinc-800 rounded-xl text-white outline-none focus:border-[#A3E635]" />
        <input placeholder="Temat" required value=${title} onChange=${e => setTitle(e.target.value)} className="w-full p-5 bg-black border border-zinc-800 rounded-xl text-white outline-none focus:border-[#A3E635]" />
        <input placeholder="Adres" required value=${address} onChange=${e => setAddress(e.target.value)} className="w-full p-5 bg-black border border-zinc-800 rounded-xl text-white outline-none focus:border-[#A3E635]" />
        <textarea placeholder="Opis usterki..." required value=${description} onChange=${e => setDescription(e.target.value)} className="w-full p-5 bg-black border border-zinc-800 rounded-xl text-white min-h-[120px] outline-none focus:border-[#A3E635]" />
        <button type="submit" className="w-full bg-[#A3E635] text-black font-black py-5 rounded-xl uppercase tracking-widest shadow-xl shadow-lime-500/10 hover:bg-lime-300 transition-all">Wyślij Serwis</button>
      </form>

      ${tasks.length > 0 && html`
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4">Twoje ostatnie zgłoszenia</h3>
           ${tasks.slice(0, 3).map(t => html`
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 flex justify-between items-center">
                <div>
                   <p className="text-sm font-black text-white uppercase">${t.title}</p>
                   <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">${new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-[9px] font-black text-[#A3E635] uppercase tracking-widest">${t.status}</span>
              </div>
           `)}
        </div>
      `}
    </div>
  `;
};

export default ClientPortal;
