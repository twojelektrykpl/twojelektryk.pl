
import React from 'react';
import htm from 'htm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TaskStatus } from '../types.js';

const html = htm.bind(React.createElement);

const Statistics = ({ tasks }) => {
  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED);
  
  const totalMinutes = completedTasks.reduce((acc, t) => acc + (t.timeSpentMinutes || 0), 0);
  const avgMinutes = completedTasks.length > 0 ? (totalMinutes / completedTasks.length).toFixed(0) : 0;

  const dataByStatus = Object.values(TaskStatus).map(status => ({
    name: status,
    value: tasks.filter(t => t.status === status).length
  }));

  const COLORS = ['#f97316', '#A3E635', '#27272a'];

  return html`
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-2">Wszystkie</p>
          <p className="text-4xl font-black text-white">${tasks.length}</p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-2">Gotowe</p>
          <p className="text-4xl font-black text-[#A3E635]">${completedTasks.length}</p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-2">Czas (h)</p>
          <p className="text-4xl font-black text-white">${(totalMinutes / 60).toFixed(1)}</p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-2">Średnia</p>
          <p className="text-4xl font-black text-white">${avgMinutes}</p>
        </div>
      </div>
      
      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 h-80">
        <${ResponsiveContainer} width="100%" height="100%">
          <${BarChart} data=${dataByStatus}>
            <${XAxis} dataKey="name" fontSize=${10} stroke="#52525b" fontWeight="bold" />
            <${Bar} dataKey="value" radius=${[8, 8, 0, 0]}>
              ${dataByStatus.map((e, i) => html`<${Cell} key=${i} fill=${COLORS[i % COLORS.length]} />`)}
            <//>
          <//>
        <//>
      </div>
    </div>
  `;
};

export default Statistics;
