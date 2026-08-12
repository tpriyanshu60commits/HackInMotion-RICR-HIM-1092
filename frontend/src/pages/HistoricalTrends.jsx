import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const mockData = [
  { name: 'Mon', aqi: 65, pm25: 28, pm10: 55 },
  { name: 'Tue', aqi: 59, pm25: 24, pm10: 48 },
  { name: 'Wed', aqi: 80, pm25: 35, pm10: 72 },
  { name: 'Thu', aqi: 92, pm25: 42, pm10: 85 },
  { name: 'Fri', aqi: 110, pm25: 55, pm10: 105 },
  { name: 'Sat', aqi: 85, pm25: 38, pm10: 76 },
  { name: 'Sun', aqi: 72, pm25: 31, pm10: 64 },
];

export const HistoricalTrends = () => {
  const [range, setRange] = useState('7 Days');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Historical Analytics</h1>
          <p className="text-text-muted">Track environmental changes and patterns over time.</p>
        </div>
        
        <div className="flex bg-surface border border-border rounded-xl p-1 shadow-sm">
          {['7 Days', '30 Days', '90 Days'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                range === r ? 'bg-primary-500 text-white shadow' : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insight Cards */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <GlassCard className="flex-1 bg-primary-500/5 border-primary-500/20">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-primary-700 dark:text-primary-400">
              <Activity size={18} /> Trend Analysis
            </h3>
            <p className="text-text-main font-medium leading-relaxed mb-4">
              Air quality worsened compared with the previous period. The average AQI increased by 15%.
            </p>
            <div className="flex items-center gap-2 text-red-500 font-bold bg-red-500/10 px-3 py-2 rounded-lg w-fit">
              <TrendingUp size={20} />
              AQI +15%
            </div>
          </GlassCard>

          <GlassCard className="flex-1">
             <h3 className="font-bold text-text-muted text-sm mb-4">Average Pollutants ({range})</h3>
             <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">PM2.5</span>
                    <span className="font-bold">36.1 µg/m³</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">PM10</span>
                    <span className="font-bold">72.1 µg/m³</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
             </div>
          </GlassCard>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-text-muted"/> 
              AQI Trend
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}
                    itemStyle={{ color: 'var(--text-main)', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="aqi" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
