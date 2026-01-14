
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Task, TaskStatus } from '../types';

interface Props {
  tasks: Task[];
}

const Statistics: React.FC<Props> = ({ tasks }) => {
  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED);
  
  const totalMinutes = completedTasks.reduce((acc, t) => acc + (t.timeSpentMinutes || 0), 0);
  const avgMinutes = completedTasks.length > 0 ? (totalMinutes / completedTasks.length).toFixed(0) : 0;

  const dataByStatus = Object.values(TaskStatus).map(status => ({
    name: status,
    value: tasks.filter(t => t.status === status).length
  }));

  const COLORS = ['#f97316', '#A3E635', '#27272a'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-zinc-800 p-4 rounded-xl shadow-2xl">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
          <p className="text-lg font-bold text-white">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-800">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-3">Wszystkie</p>
          <p className="text-4xl font-black text-white">{tasks.length}</p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-800">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-3">Zakończone</p>
          <p className="text-4xl font-black text-[#A3E635]">{completedTasks.length}</p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-800">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-3">Godziny</p>
          <p className="text-4xl font-black text-white">{(totalMinutes / 60).toFixed(1)} <span className="text-xs font-bold text-zinc-700">h</span></p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-800">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-3">Średnia</p>
          <p className="text-4xl font-black text-white">{avgMinutes} <span className="text-xs font-bold text-zinc-700">min</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 min-w-0">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-10">Rozkład Statusów</h3>
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={dataByStatus} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#18181b'}} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {dataByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 min-w-0">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-10">Efektywność Pracy</h3>
          <div className="h-72 w-full min-w-0 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={dataByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {dataByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-6 mt-6">
             {dataByStatus.map((s, i) => (
               <div key={s.name} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                 {s.name}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
