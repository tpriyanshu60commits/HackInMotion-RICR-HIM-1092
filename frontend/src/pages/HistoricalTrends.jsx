import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, TrendingUp, TrendingDown, Calendar, Wind } from 'lucide-react';

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
    <div 
      className="min-h-full relative px-2 lg:px-4 pb-10"
    style={{
  backgroundImage: `
    linear-gradient(
      rgba(1, 11, 7, 0.4),
      rgba(0, 0, 0, 0.4)
    ),
    url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop")
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
}}
    >
      {/* Header and Filters Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white drop-shadow-md">Historical Trends</h1>
          <p className="text-sm text-gray-400 font-medium">Track environmental changes and patterns over time.</p>
        </div>
        
        {/* Compact Glass Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Mock AQI dropdown for visual completeness as requested */}
          <div className="flex items-center gap-2 bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] rounded-full px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/[0.06] cursor-pointer">
            <span className="font-semibold text-gray-200">Metric:</span>
            <span className="text-gray-400">AQI</span>
            <span className="text-gray-500 text-[10px] ml-1">▼</span>
          </div>

          <div className="flex bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] rounded-full p-1 shadow-sm">
            {['7 Days', '30 Days', '90 Days'].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                  range === r 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Panel */}
      <div className="mb-6">
        <GlassCard hover={false} className="p-6 md:p-8 bg-white/[0.02] border-white/[0.06] backdrop-blur-[24px]">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8 flex items-center gap-2">
            <Calendar size={16} className="text-green-500"/> 
            AQI Trend ({range})
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 12, fontWeight: 500}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 12, fontWeight: 500}} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10,15,13,0.9)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: '#22C55E', fontWeight: 'bold' }}
                  labelStyle={{ color: '#9CA3AF', fontWeight: '600', marginBottom: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="aqi" 
                  stroke="#22C55E" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorAqi)"
                  activeDot={{ r: 5, fill: '#22C55E', stroke: '#0A0F0D', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Trend Analysis Card */}
        <GlassCard className="flex flex-col p-6 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out cursor-default">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity size={14} className="text-gray-500" /> 
            Trend Analysis
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-4xl font-black text-white mb-3 tracking-tighter">
              +15%
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              Worsened AQI
            </div>
          </div>
        </GlassCard>

        {/* PM2.5 Average Card */}
        <GlassCard className="flex flex-col p-6 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out cursor-default">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wind size={14} className="text-gray-500" /> 
            Average PM2.5 ({range})
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-4xl font-black text-white mb-3 tracking-tighter flex items-baseline gap-1">
              36.1 <span className="text-sm font-semibold text-gray-500 tracking-normal">µg/m³</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
              Moderate
            </div>
          </div>
        </GlassCard>

        {/* PM10 Average Card */}
        <GlassCard className="flex flex-col p-6 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out cursor-default">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wind size={14} className="text-gray-500" /> 
            Average PM10 ({range})
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-4xl font-black text-white mb-3 tracking-tighter flex items-baseline gap-1">
              72.1 <span className="text-sm font-semibold text-gray-500 tracking-normal">µg/m³</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-500">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
              Unhealthy
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};
